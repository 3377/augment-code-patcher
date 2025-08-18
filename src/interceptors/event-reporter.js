/**
 * Augment Code Extension 事件报告拦截器
 * 
 * 精确拦截enableUpload()方法调用，而不是依赖网络层拦截
 */

import { INTERCEPTOR_CONFIG, EVENT_REPORTER_TYPES } from '../config.js';
import { log } from '../utils/logger.js';

/**
 * 精确的Event Reporter拦截器
 */
export const PreciseEventReporterInterceptor = {
    // 拦截统计
    interceptionStats: {
        totalInterceptions: 0,
        byReporter: {},
        byMethod: {},
        lastInterception: null
    },

    /**
     * 记录拦截统计
     * @param {string} reporterType - 报告器类型
     * @param {string} method - 方法名
     */
    recordInterception(reporterType, method) {
        this.interceptionStats.totalInterceptions++;
        this.interceptionStats.byReporter[reporterType] = (this.interceptionStats.byReporter[reporterType] || 0) + 1;
        this.interceptionStats.byMethod[method] = (this.interceptionStats.byMethod[method] || 0) + 1;
        this.interceptionStats.lastInterception = {
            reporterType,
            method,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * 获取拦截统计
     * @returns {Object} 拦截统计信息
     */
    getInterceptionStats() {
        return {
            ...this.interceptionStats,
            topReporters: Object.entries(this.interceptionStats.byReporter)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5),
            topMethods: Object.entries(this.interceptionStats.byMethod)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
        };
    },

    /**
     * 重置拦截统计
     */
    resetInterceptionStats() {
        this.interceptionStats = {
            totalInterceptions: 0,
            byReporter: {},
            byMethod: {},
            lastInterception: null
        };
        log('🔄 Event Reporter拦截统计已重置');
    },

    /**
     * 初始化精确的Event Reporter拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enablePreciseEventReporterControl) {
            return;
        }

        log('🎯 初始化精确Event Reporter拦截...');

        // 拦截全局对象上的Event Reporter
        this.interceptGlobalReporters();

        // 拦截可能的模块导出
        this.interceptModuleExports();

        log('✅ 精确Event Reporter拦截设置完成');
    },

    /**
     * 拦截全局对象上的Event Reporter
     */
    interceptGlobalReporters() {
        EVENT_REPORTER_TYPES.forEach(reporterType => {
            this.interceptReporterType(reporterType);
        });
    },

    /**
     * 拦截特定类型的Reporter
     * @param {string} reporterType - Reporter类型名称
     */
    interceptReporterType(reporterType) {
        // 尝试在多个可能的全局对象上查找
        const globalObjects = [];

        // 安全地添加全局对象
        if (typeof global !== 'undefined') globalObjects.push(global);
        if (typeof window !== 'undefined') globalObjects.push(window);
        if (typeof self !== 'undefined') globalObjects.push(self);

        globalObjects.forEach(globalObj => {
            if (globalObj && globalObj[reporterType]) {
                this.interceptReporterInstance(globalObj[reporterType], reporterType);
            }
        });
    },

    /**
     * 拦截Reporter实例的enableUpload方法
     * @param {Object} reporter - Reporter实例
     * @param {string} reporterType - Reporter类型
     */
    interceptReporterInstance(reporter, reporterType) {
        if (!reporter || typeof reporter !== 'object') return;

        if (typeof reporter.enableUpload === 'function') {
            const originalEnableUpload = reporter.enableUpload;

            reporter.enableUpload = function(...args) {
                log(`🎭 拦截 ${reporterType}.enableUpload() 调用`);

                // 详细记录拦截信息
                const interceptInfo = {
                    reporterType: reporterType,
                    method: 'enableUpload',
                    timestamp: new Date().toISOString(),
                    args: args.length > 0 ? `${args.length} 个参数` : '无参数',
                    action: '拦截'
                };

                // 打印详细的拦截日志
                console.log('\n📊 Event Reporter 拦截详情:');
                console.log(`  🎯 Reporter类型: ${interceptInfo.reporterType}`);
                console.log(`  🔧 调用方法: ${interceptInfo.method}()`);
                console.log(`  ⏰ 拦截时间: ${interceptInfo.timestamp}`);
                console.log(`  📋 参数信息: ${interceptInfo.args}`);
                console.log(`  🚫 执行动作: ${interceptInfo.action}`);

                // 如果有参数，尝试显示参数内容（安全地）
                if (args.length > 0) {
                    try {
                        args.forEach((arg, index) => {
                            if (arg !== null && arg !== undefined) {
                                const argType = typeof arg;
                                const argPreview = argType === 'object' ?
                                    `[${argType}] ${Object.keys(arg).length} 个属性` :
                                    `[${argType}] ${String(arg).substring(0, 50)}${String(arg).length > 50 ? '...' : ''}`;
                                console.log(`    参数 ${index + 1}: ${argPreview}`);
                            }
                        });
                    } catch (e) {
                        console.log(`    参数解析失败: ${e.message}`);
                    }
                }

                // 记录拦截统计
                PreciseEventReporterInterceptor.recordInterception(reporterType, 'enableUpload');

                // 返回假的成功响应，避免扩展报错
                return Promise.resolve({
                    success: true,
                    intercepted: true,
                    timestamp: new Date().toISOString(),
                    message: 'Event upload intercepted by AugmentCode'
                });
            };

            log(`✅ 已拦截 ${reporterType}.enableUpload() 方法`);
        }
    },

    /**
     * 拦截可能的模块导出
     */
    interceptModuleExports() {
        // 拦截require调用以捕获Event Reporter模块
        if (typeof require !== 'undefined') {
            const originalRequire = require;

            require = function(moduleName) {
                const module = originalRequire.apply(this, arguments);

                // 检查模块是否包含Event Reporter
                if (module && typeof module === 'object') {
                    EVENT_REPORTER_TYPES.forEach(reporterType => {
                        if (module[reporterType] && typeof module[reporterType] === 'object') {
                            log(`🎯 检测到模块中的Event Reporter: ${moduleName}.${reporterType}`);
                            PreciseEventReporterInterceptor.interceptReporterInstance(module[reporterType], reporterType);
                        }
                    });
                }

                return module;
            };

            // 保留原始require的属性
            Object.setPrototypeOf(require, originalRequire);
            Object.getOwnPropertyNames(originalRequire).forEach(prop => {
                if (prop !== 'length' && prop !== 'name') {
                    require[prop] = originalRequire[prop];
                }
            });
        }
    }
};
