/**
 * Augment Code Extension 日志工具模块
 * 
 * 提供统一的日志输出和去重功能
 */

import { INTERCEPTOR_CONFIG } from '../config.js';

// 日志去重机制
const loggedMessages = new Set();

/**
 * 智能日志函数 - 相同类型的日志只打印一次
 * @param {string} message - 日志消息
 * @param {string} type - 日志类型（用于去重）
 */
export function logOnce(message, type = null) {
    const logKey = type || message;
    if (!loggedMessages.has(logKey)) {
        loggedMessages.add(logKey);
        console.log(`[AugmentCode拦截器] ${message}`);
    }
}

/**
 * 日志输出函数
 * @param {string} message - 日志消息
 * @param {string} level - 日志级别 (info, warn, error)
 */
export function log(message, level = 'info') {
    if (!INTERCEPTOR_CONFIG.debugMode) return;

    const prefix = '[AugmentCode拦截器]';
    switch (level) {
        case 'warn':
            console.warn(`${prefix} ⚠️ ${message}`);
            break;
        case 'error':
            console.error(`${prefix} ❌ ${message}`);
            break;
        default:
            console.log(`${prefix} ${message}`);
    }
}

/**
 * 清除日志去重缓存
 */
export function clearLogCache() {
    loggedMessages.clear();
}

/**
 * 获取已记录的日志数量
 * @returns {number} 已记录的唯一日志数量
 */
export function getLoggedCount() {
    return loggedMessages.size;
}
