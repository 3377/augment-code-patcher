/**
 * Augment Code Extension API服务器错误报告拦截器
 * 
 * 拦截_apiServer.reportError()方法调用
 */

import { INTERCEPTOR_CONFIG, CODE_INDEXING_PATTERNS } from '../config.js';
import { log } from '../utils/logger.js';

/**
 * API服务器错误报告拦截器
 */
export const ApiServerErrorReportInterceptor = {
    /**
     * 初始化API服务器错误报告拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enableApiServerErrorReportInterception) {
            return;
        }

        log('🚫 初始化API服务器错误报告拦截...');

        this.interceptApiServerInstances();
        this.interceptApiServerConstructors();

        log('✅ API服务器错误报告拦截设置完成');
    },

    /**
     * 拦截现有的API服务器实例
     */
    interceptApiServerInstances() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        // 检查常见的API服务器实例名称
        const commonApiServerNames = [
            '_apiServer', 'apiServer', 'server', 'httpServer',
            'expressServer', 'app', 'application'
        ];

        commonApiServerNames.forEach(name => {
            if (globalObj[name] && typeof globalObj[name] === 'object') {
                if (typeof globalObj[name].reportError === 'function') {
                    this.interceptReportErrorMethod(globalObj[name], name);
                }
            }
        });

        // 定期检查新的API服务器实例
        let checkCount = 0;
        const checkInterval = setInterval(() => {
            checkCount++;
            
            commonApiServerNames.forEach(name => {
                if (globalObj[name] && typeof globalObj[name] === 'object') {
                    if (typeof globalObj[name].reportError === 'function' && 
                        !globalObj[name]._augmentErrorReportIntercepted) {
                        this.interceptReportErrorMethod(globalObj[name], name);
                    }
                }
            });
            
            // 检查30次后停止（约30秒）
            if (checkCount >= 30) {
                clearInterval(checkInterval);
                log('⏰ API服务器实例检查定时器已停止');
            }
        }, 1000);
    },

    /**
     * 拦截API服务器构造函数
     */
    interceptApiServerConstructors() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        // 拦截常见的API服务器构造函数
        const constructorNames = ['ApiServer', 'Server', 'HttpServer', 'ExpressServer'];

        constructorNames.forEach(name => {
            if (typeof globalObj[name] === 'function') {
                this.interceptConstructor(globalObj, name);
            }
        });
    },

    /**
     * 拦截构造函数
     * @param {Object} globalObj - 全局对象
     * @param {string} name - 构造函数名称
     */
    interceptConstructor(globalObj, name) {
        const originalConstructor = globalObj[name];

        globalObj[name] = function(...args) {
            const instance = new originalConstructor(...args);

            // 拦截新创建实例的reportError方法
            if (typeof instance.reportError === 'function') {
                ApiServerErrorReportInterceptor.interceptReportErrorMethod(instance, `${name} instance`);
            }

            return instance;
        };

        // 保留原始构造函数的属性
        Object.setPrototypeOf(globalObj[name], originalConstructor);
        Object.getOwnPropertyNames(originalConstructor).forEach(prop => {
            if (prop !== 'length' && prop !== 'name' && prop !== 'prototype') {
                globalObj[name][prop] = originalConstructor[prop];
            }
        });
    },

    /**
     * 拦截reportError方法
     * @param {Object} apiServer - API服务器实例
     * @param {string} instanceName - 实例名称
     */
    interceptReportErrorMethod(apiServer, instanceName) {
        const originalReportError = apiServer.reportError;

        apiServer.reportError = function(message, stackTrace, requestId, ...args) {
            const sanitizedMessage = typeof message === 'string' ? message.substring(0, 200) : String(message).substring(0, 200);
            const originalRequestId = requestId || 'unknown';

            log(`🚫 拦截API服务器错误报告: ${instanceName}`);
            log(`   错误类型: ${sanitizedMessage}`);
            log(`   请求ID: ${originalRequestId}`);

            // 检查是否为代码索引相关的错误
            if (ApiServerErrorReportInterceptor.isCodeIndexingRelatedError(sanitizedMessage, stackTrace)) {
                log(`✅ 允许代码索引相关的错误报告: ${sanitizedMessage}`);
                return originalReportError.apply(this, arguments);
            }

            // 拦截遥测相关的错误报告
            log(`🚫 阻止遥测相关的错误报告: ${sanitizedMessage}`);
            return Promise.resolve(); // 返回成功，避免扩展报错
        };

        // 标记为已拦截
        apiServer._augmentErrorReportIntercepted = true;
        log(`🎯 已拦截 ${instanceName} 的 reportError 方法`);
    },

    /**
     * 判断错误是否与代码索引相关
     * @param {string} message - 错误消息
     * @param {string} stackTrace - 堆栈跟踪
     * @returns {boolean} 是否与代码索引相关
     */
    isCodeIndexingRelatedError(message, stackTrace) {
        if (!message && !stackTrace) return false;

        const combinedText = `${message || ''} ${stackTrace || ''}`.toLowerCase();

        // 检查是否包含代码索引相关的关键词
        const isCodeIndexingRelated = CODE_INDEXING_PATTERNS.some(pattern =>
            combinedText.includes(pattern.toLowerCase())
        );

        if (isCodeIndexingRelated) {
            log(`✅ 检测到代码索引相关错误`);
            return true;
        }

        // 检查是否包含重要功能相关的关键词
        const importantFeatureKeywords = [
            'completion', 'chat', 'memorize', 'retrieval', 'upload',
            'workspace', 'symbol', 'index', 'blob', 'codebase',
            'augment-api', 'augment-backend', 'agents'
        ];

        const isImportantFeature = importantFeatureKeywords.some(keyword =>
            combinedText.includes(keyword)
        );

        if (isImportantFeature) {
            log(`✅ 检测到重要功能相关错误`);
            return true;
        }

        // 检查是否为遥测相关错误
        const telemetryKeywords = [
            'telemetry', 'analytics', 'tracking', 'metrics', 'stats',
            'event', 'report', 'segment', 'collect', 'gather'
        ];

        const isTelemetryRelated = telemetryKeywords.some(keyword =>
            combinedText.includes(keyword)
        );

        if (isTelemetryRelated) {
            log(`🚫 检测到遥测相关错误`);
            return false;
        }

        // 默认允许其他错误报告（保守策略）
        log(`⚪ 未知错误类型，采用保守策略允许报告`);
        return true;
    }
};
