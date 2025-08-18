/**
 * Augment Code Extension 智能JSON拦截器
 * 
 * 更保守的JSON拦截策略，避免影响正常功能
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log, logOnce } from '../utils/logger.js';
import { SmartDataClassifier } from '../core/classifier.js';

/**
 * 智能JSON拦截器（暂时禁用）
 */
export const SmartJsonInterceptor = {
    /**
     * 初始化智能JSON拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enableJsonCleaning) {
            return;
        }

        log('🔍 初始化智能JSON拦截...');

        this.interceptJsonStringify();

        log('✅ 智能JSON拦截设置完成');
    },

    /**
     * 拦截JSON.stringify（修复无限递归问题）
     */
    interceptJsonStringify() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (typeof globalObj.JSON !== 'undefined' && globalObj.JSON.stringify) {
            const originalStringify = globalObj.JSON.stringify;

            globalObj.JSON.stringify = function(value, replacer, space) {
                try {
                    // v2.5修复：避免无限递归，直接检查原始值而不是序列化后的字符串
                    const valueStr = typeof value === 'string' ? value :
                                    (value && typeof value === 'object' ? Object.keys(value).join(' ') : String(value));

                    // 检查是否为代码索引相关数据
                    if (SmartDataClassifier.isCodeIndexingRelated(valueStr, 'JSON.stringify')) {
                        log('✅ 允许代码索引相关的JSON序列化');
                        return originalStringify.apply(this, arguments);
                    }

                    // 检查是否为遥测数据
                    if (SmartDataClassifier.isTelemetryData(valueStr, 'JSON.stringify')) {
                        logOnce('🚫 拦截遥测相关的JSON序列化', 'json-telemetry-intercept');
                        return SmartJsonInterceptor.createSafeReplacer(value, replacer, space, originalStringify);
                    }

                    // 默认允许（保守策略）
                    return originalStringify.apply(this, arguments);

                } catch (e) {
                    // 如果检查失败，使用原始方法（保守策略）
                    log(`⚠️ JSON拦截检查失败，使用原始方法: ${e.message}`, 'warn');
                    return originalStringify.apply(this, arguments);
                }
            };
        }
    },

    /**
     * 创建安全的替换器
     * @param {any} value - 原始值
     * @param {Function} replacer - 原始替换器
     * @param {string|number} space - 空格参数
     * @param {Function} originalStringify - 原始JSON.stringify方法
     * @returns {string} 安全的JSON字符串
     */
    createSafeReplacer(value, replacer, space, originalStringify) {
        const safeReplacer = function(key, val) {
            // 移除敏感字段
            const sensitiveFields = [
                'sessionId', 'userId', 'machineId', 'deviceId',
                'email', 'username', 'token', 'password',
                'analytics', 'telemetry', 'tracking'
            ];

            if (sensitiveFields.includes(key)) {
                return '[REDACTED]';
            }

            // 如果有原始replacer，先应用它
            if (typeof replacer === 'function') {
                val = replacer.call(this, key, val);
            }

            return val;
        };

        // 使用传入的原始stringify方法，避免递归调用
        return originalStringify(value, safeReplacer, space);
    }
};
