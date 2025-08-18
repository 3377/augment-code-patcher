/**
 * Augment Code Extension 智能数据分类器
 * 
 * 精确区分代码索引数据和遥测数据，提供智能拦截决策
 */

import { 
    ESSENTIAL_ENDPOINTS, 
    PRECISE_TELEMETRY_ENDPOINTS, 
    CODE_INDEXING_PATTERNS, 
    TELEMETRY_PATTERNS 
} from '../config.js';
import { log } from '../utils/logger.js';

/**
 * 智能数据分类器
 * 精确区分代码索引数据和遥测数据
 */
export const SmartDataClassifier = {
    /**
     * 检查是否为必要端点（最高优先级保护）
     * @param {string} context - 上下文信息（通常是URL）
     * @returns {boolean} 是否为必要端点
     */
    isEssentialEndpoint(context = '') {
        if (!context) return false;

        const contextStr = context.toLowerCase();

        // 检查是否匹配必要端点
        const isEssential = ESSENTIAL_ENDPOINTS.some(endpoint => {
            const endpointLower = endpoint.toLowerCase();
            return contextStr.includes(endpointLower);
        });

        if (isEssential) {
            log(`🛡️ 必要端点保护: ${context}`);
            return true;
        }

        return false;
    },

    /**
     * 检查是否为精确的遥测端点
     * @param {string} context - 上下文信息（通常是URL）
     * @returns {boolean} 是否为精确的遥测端点
     */
    isPreciseTelemetryEndpoint(context = '') {
        if (!context) return false;

        const contextStr = context.toLowerCase();

        // 检查是否匹配精确的遥测端点
        const isExactMatch = PRECISE_TELEMETRY_ENDPOINTS.some(endpoint => {
            const endpointLower = endpoint.toLowerCase();
            return contextStr.includes(endpointLower);
        });

        if (isExactMatch) {
            log(`🚫 精确匹配遥测端点: ${context}`);
            return true;
        }

        return false;
    },

    /**
     * 检查数据是否为代码索引相关
     * @param {string|Object} data - 要检查的数据
     * @param {string} context - 上下文信息（URL、方法名等）
     * @returns {boolean} 是否为代码索引相关
     */
    isCodeIndexingRelated(data, context = '') {
        if (!data) return false;
        
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const contextStr = context.toLowerCase();
        
        // 检查代码索引模式
        const matchedPattern = CODE_INDEXING_PATTERNS.find(pattern =>
            dataStr.toLowerCase().includes(pattern.toLowerCase()) ||
            contextStr.includes(pattern.toLowerCase())
        );

        if (matchedPattern) {
            log(`✅ 识别为代码索引数据 [匹配模式: ${matchedPattern}]: ${context}`);
            return true;
        }

        return false;
    },

    /**
     * 检查数据是否为遥测数据
     * @param {string|Object} data - 要检查的数据
     * @param {string} context - 上下文信息
     * @returns {boolean} 是否为遥测数据
     */
    isTelemetryData(data, context = '') {
        if (!data) return false;
        
        const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
        const contextStr = context.toLowerCase();
        
        // 检查遥测模式
        const matchedPattern = TELEMETRY_PATTERNS.find(pattern =>
            dataStr.toLowerCase().includes(pattern.toLowerCase()) ||
            contextStr.includes(pattern.toLowerCase())
        );

        if (matchedPattern) {
            log(`🚫 识别为遥测数据 [匹配模式: ${matchedPattern}]: ${context}`);
            return true;
        }

        return false;
    },

    /**
     * v2.5改进：智能决策是否应该拦截上传（分层检查逻辑）
     * @param {string|Object} data - 数据
     * @param {string} context - 上下文
     * @returns {boolean} 是否应该拦截
     */
    shouldInterceptUpload(data, context = '') {
        // 第零层：必要端点保护（最高优先级，绝对不拦截）
        if (this.isEssentialEndpoint(context)) {
            log(`🛡️ [第零层] 必要端点保护，绝对不拦截: ${context}`);
            return false; // 绝对不拦截必要端点
        }

        // 第一层：精确遥测端点检查（高优先级）
        if (this.isPreciseTelemetryEndpoint(context)) {
            log(`🚫 [第一层] 精确遥测端点拦截: ${context}`);
            return true; // 必须拦截精确的遥测端点
        }

        // 第二层：通用遥测关键字检查
        if (this.isTelemetryData(data, context)) {
            log(`🚫 [第二层] 遥测关键字拦截: ${context}`);
            return true; // 拦截遥测数据
        }

        // 第三层：代码索引功能检查
        if (this.isCodeIndexingRelated(data, context)) {
            log(`✅ [第三层] 代码索引功能保护: ${context}`);
            return false; // 不拦截代码索引
        }

        // 第四层：默认保守策略
        log(`⚪ [第四层] 未知数据，采用保守策略: ${context}`);
        return false; // 不拦截未知数据
    }
};
