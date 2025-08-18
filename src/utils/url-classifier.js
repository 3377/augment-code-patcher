/**
 * Augment Code Extension URL分类工具
 * 
 * 提供URL拦截判断和缓存功能
 */

import { INTERCEPTOR_CONFIG, CODE_INDEXING_PATTERNS, INTERCEPT_PATTERNS } from '../config.js';
import { log } from './logger.js';

/**
 * URL分类缓存器
 * 缓存URL分类结果，提高性能
 */
export const URLClassificationCache = {
    // 缓存存储
    cache: new Map(),

    // 缓存统计
    stats: {
        hits: 0,
        misses: 0,
        totalRequests: 0
    },

    // 缓存大小限制
    maxCacheSize: 1000,

    /**
     * 获取缓存的分类结果
     * @param {string} url - URL
     * @param {string} data - 请求数据
     * @returns {Object|null} 缓存的分类结果或null
     */
    get(url, data = '') {
        this.stats.totalRequests++;

        // 生成缓存键（URL + 数据摘要）
        const cacheKey = this.generateCacheKey(url, data);

        if (this.cache.has(cacheKey)) {
            this.stats.hits++;
            const cached = this.cache.get(cacheKey);
            log(`💾 缓存命中: ${url} -> ${cached.shouldIntercept ? '拦截' : '放行'}`);
            return cached;
        }

        this.stats.misses++;
        return null;
    },

    /**
     * 设置缓存
     * @param {string} url - URL
     * @param {string} data - 请求数据
     * @param {Object} result - 分类结果
     */
    set(url, data = '', result) {
        const cacheKey = this.generateCacheKey(url, data);

        // 如果缓存已满，删除最旧的条目
        if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            log(`🗑️ 缓存已满，删除最旧条目: ${firstKey}`);
        }

        this.cache.set(cacheKey, {
            ...result,
            timestamp: Date.now(),
            url: url
        });

        log(`💾 缓存设置: ${url} -> ${result.shouldIntercept ? '拦截' : '放行'}`);
    },

    /**
     * 生成缓存键
     * @param {string} url - URL
     * @param {string} data - 请求数据
     * @returns {string} 缓存键
     */
    generateCacheKey(url, data = '') {
        // 对于有数据的请求，生成数据摘要
        let dataHash = '';
        if (data && typeof data === 'string' && data.length > 0) {
            // 简单哈希算法
            let hash = 0;
            for (let i = 0; i < Math.min(data.length, 100); i++) {
                const char = data.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // 转换为32位整数
            }
            dataHash = `_${hash}`;
        }

        return `${url}${dataHash}`;
    },

    /**
     * 清空缓存
     */
    clear() {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, totalRequests: 0 };
        log('🗑️ URL分类缓存已清空');
    },

    /**
     * 获取缓存统计
     * @returns {Object} 缓存统计信息
     */
    getStats() {
        const hitRate = this.stats.totalRequests > 0 ?
            (this.stats.hits / this.stats.totalRequests * 100).toFixed(2) : 0;

        return {
            cacheSize: this.cache.size,
            maxCacheSize: this.maxCacheSize,
            hits: this.stats.hits,
            misses: this.stats.misses,
            totalRequests: this.stats.totalRequests,
            hitRate: `${hitRate}%`
        };
    },

    /**
     * 打印缓存统计
     */
    printStats() {
        const stats = this.getStats();
        console.log('\n📊 URL分类缓存统计');
        console.log('='.repeat(30));
        console.log(`缓存大小: ${stats.cacheSize}/${stats.maxCacheSize}`);
        console.log(`缓存命中: ${stats.hits}`);
        console.log(`缓存未命中: ${stats.misses}`);
        console.log(`总请求数: ${stats.totalRequests}`);
        console.log(`命中率: ${stats.hitRate}`);
        console.log('='.repeat(30));
    }
};

/**
 * v2.5改进：更智能的URL拦截判断（带缓存优化）
 * @param {string} url - 要检查的URL
 * @param {string} data - 请求数据（可选）
 * @returns {boolean} 是否应该拦截
 */
export function shouldInterceptUrl(url, data = '') {
    if (typeof url !== "string") return false;

    // 检查缓存
    const cached = URLClassificationCache.get(url, data);
    if (cached !== null) {
        return cached.shouldIntercept;
    }

    const urlLower = url.toLowerCase();
    let shouldIntercept = false;
    let reason = '';

    // 优先检查代码索引白名单
    if (INTERCEPTOR_CONFIG.dataProtection.enableEnhancedWhitelist) {
        const isCodeIndexing = CODE_INDEXING_PATTERNS.some(pattern =>
            urlLower.includes(pattern.toLowerCase())
        );

        if (isCodeIndexing) {
            shouldIntercept = false;
            reason = '代码索引白名单保护';
            log(`✅ 代码索引白名单保护: ${url}`);
        }
    }

    if (!shouldIntercept) {
        // 检查是否匹配拦截模式
        const matchesInterceptPattern = INTERCEPT_PATTERNS.some(pattern =>
            urlLower.includes(pattern.toLowerCase())
        );

        if (matchesInterceptPattern) {
            // 检查是否为重要功能URL（不拦截）
            const importantPatterns = [
                'vscode-webview://', 'vscode-file://', 'vscode-resource://',
                'localhost:', '127.0.0.1:', 'file://', 'data:', 'blob:',
                'chrome-extension://', 'moz-extension://', 'ms-browser-extension://'
            ];

            const isImportant = importantPatterns.some(pattern =>
                urlLower.includes(pattern)
            );

            if (isImportant) {
                shouldIntercept = false;
                reason = '重要功能URL保护';
                if (INTERCEPTOR_CONFIG.network.logInterceptions) {
                    log(`✅ 允许重要功能URL: ${url}`);
                }
            } else {
                shouldIntercept = true;
                reason = '匹配拦截模式';
            }
        } else {
            shouldIntercept = false;
            reason = '未匹配拦截模式';
        }
    }

    // 缓存结果
    const result = { shouldIntercept, reason };
    URLClassificationCache.set(url, data, result);

    return shouldIntercept;
}
