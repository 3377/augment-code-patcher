/**
 * Augment Code Extension 会话管理器
 * 
 * 负责生成和管理会话ID，替换请求中的敏感标识符
 */

import { log } from '../utils/logger.js';

/**
 * 生成UUID格式的随机ID
 * @returns {string} UUID格式的字符串
 */
function generateUUID() {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            result += "-";
        } else if (i === 14) {
            result += "4";
        } else if (i === 19) {
            result += chars[8 + Math.floor(Math.random() * 4)];
        } else {
            result += chars[Math.floor(Math.random() * 16)];
        }
    }
    return result;
}

/**
 * 检查值是否为会话ID格式
 * @param {any} value - 要检查的值
 * @returns {boolean} 是否为会话ID
 */
function isSessionId(value) {
    if (typeof value !== "string") return false;
    
    // UUID格式检查
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(value)) return true;
    
    // 其他会话ID格式
    if (value.length >= 16 && /^[a-zA-Z0-9_-]+$/.test(value)) return true;
    
    return false;
}

/**
 * 会话管理器
 */
export const SessionManager = {
    // 生成的会话ID缓存
    sessionIds: {
        main: generateUUID(),
        user: generateUUID(),
        anonymous: generateUUID()
    },

    /**
     * 获取主会话ID
     * @returns {string} 主会话ID
     */
    getMainSessionId() {
        return this.sessionIds.main;
    },

    /**
     * 获取用户ID
     * @returns {string} 用户ID
     */
    getUserId() {
        return this.sessionIds.user;
    },

    /**
     * 获取匿名ID
     * @returns {string} 匿名ID
     */
    getAnonymousId() {
        return this.sessionIds.anonymous;
    },

    /**
     * 重新生成所有会话ID
     */
    regenerateAll() {
        this.sessionIds.main = generateUUID();
        this.sessionIds.user = generateUUID();
        this.sessionIds.anonymous = generateUUID();
        log('🔄 已重新生成所有会话ID');
    },

    /**
     * 替换请求头中的会话ID
     * @param {Object} headers - 请求头对象
     * @returns {boolean} 是否进行了替换
     */
    replaceSessionIds(headers) {
        if (!headers || typeof headers !== 'object') return false;

        let replaced = false;

        // 定义不同类型的ID字段及其对应的生成策略
        const idFieldMappings = {
            // 请求ID - 每次请求都应该是唯一的
            //"x-request-id": () => this.generateUniqueRequestId(),

            // 会话ID - 使用主会话ID
            "x-request-session-id": () => this.getMainSessionId(),
            // "session-id": () => this.getMainSessionId(),
            // "sessionId": () => this.getMainSessionId(),
            // "x-session-id": () => this.getMainSessionId(),

            // // 用户ID - 使用用户ID
            // "x-user-id": () => this.getUserId(),
            // "user-id": () => this.getUserId(),
            // "userId": () => this.getUserId(),
            // "x-user": () => this.getUserId()
        };

        // 处理Headers对象
        if (headers instanceof Headers) {
            Object.entries(idFieldMappings).forEach(([field, generator]) => {
                if (headers.has(field)) {
                    const originalValue = headers.get(field);
                    if (isSessionId(originalValue)) {
                        const newValue = generator();
                        headers.set(field, newValue);
                        log(`🎭 替换Headers中的${field}: ${originalValue} → ${newValue}`);
                        replaced = true;
                    }
                }
            });
        }
        // 处理普通对象
        else {
            Object.entries(idFieldMappings).forEach(([field, generator]) => {
                if (headers[field] && isSessionId(headers[field])) {
                    const originalValue = headers[field];
                    const newValue = generator();
                    headers[field] = newValue;
                    log(`🎭 替换对象中的${field}: ${originalValue} → ${newValue}`);
                    replaced = true;
                }
            });
        }

        return replaced;
    },

    /**
     * 生成唯一的请求ID
     * 每次调用都生成新的ID，用于x-request-id等字段
     */
    generateUniqueRequestId() {
        return [8,4,4,4,12].map(len =>
            Array.from({length: len}, () =>
                "0123456789abcdef"[Math.floor(Math.random() * 16)]
            ).join("")
        ).join("-");
    }
};

// 初始化日志
log(`🆔 会话管理器初始化完成，主会话ID: ${SessionManager.getMainSessionId()}`);
