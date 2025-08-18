/**
 * Augment Code Extension 分析拦截器
 * 
 * 安全的Analytics拦截，使用代理模式而不是完全替换，保留必要功能
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log } from '../utils/logger.js';

/**
 * 安全的Analytics拦截器
 */
export const SafeAnalyticsInterceptor = {
    /**
     * 初始化安全的Analytics拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enableAnalyticsBlocking) {
            return;
        }

        log('🛡️ 初始化安全Analytics拦截...');

        this.interceptWindowAnalytics();
        this.interceptSegmentAnalytics();

        log('✅ 安全Analytics拦截设置完成');
    },

    /**
     * 拦截window.Analytics对象
     */
    interceptWindowAnalytics() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (globalObj.Analytics && typeof globalObj.Analytics === 'object') {
            log('🎯 检测到window.Analytics对象，创建安全代理...');
            globalObj.Analytics = this.createAnalyticsProxy(globalObj.Analytics);
        }

        // 监听Analytics对象的动态创建
        let analyticsCheckCount = 0;
        const checkInterval = setInterval(() => {
            analyticsCheckCount++;
            
            if (globalObj.Analytics && typeof globalObj.Analytics === 'object' && !globalObj.Analytics._augmentProxied) {
                log('🎯 检测到新的window.Analytics对象，创建安全代理...');
                globalObj.Analytics = this.createAnalyticsProxy(globalObj.Analytics);
            }
            
            // 检查30次后停止（约30秒）
            if (analyticsCheckCount >= 30) {
                clearInterval(checkInterval);
                log('⏰ Analytics对象检查定时器已停止');
            }
        }, 1000);
    },

    /**
     * 创建Analytics代理对象
     * @param {Object} originalAnalytics - 原始Analytics对象
     * @returns {Proxy} Analytics代理对象
     */
    createAnalyticsProxy(originalAnalytics) {
        if (originalAnalytics._augmentProxied) {
            return originalAnalytics; // 已经代理过了
        }

        const proxy = new Proxy(originalAnalytics, {
            get: function(target, prop, receiver) {
                // 拦截track方法
                if (prop === 'track') {
                    return function(event, properties, options, callback) {
                        log(`🚫 拦截Analytics.track调用: ${event}`);
                        
                        // 返回假的成功回调
                        if (typeof callback === 'function') {
                            setTimeout(() => callback(null, { success: true }), 0);
                        }
                        
                        return Promise.resolve({ success: true, intercepted: true });
                    };
                }

                // 拦截identify方法
                if (prop === 'identify') {
                    return function(userId, traits, options, callback) {
                        log(`🚫 拦截Analytics.identify调用: ${userId}`);
                        
                        // 返回假的成功回调
                        if (typeof callback === 'function') {
                            setTimeout(() => callback(null, { success: true }), 0);
                        }
                        
                        return Promise.resolve({ success: true, intercepted: true });
                    };
                }

                // 拦截page方法
                if (prop === 'page') {
                    return function(category, name, properties, options, callback) {
                        log(`🚫 拦截Analytics.page调用: ${name || category}`);
                        
                        // 返回假的成功回调
                        if (typeof callback === 'function') {
                            setTimeout(() => callback(null, { success: true }), 0);
                        }
                        
                        return Promise.resolve({ success: true, intercepted: true });
                    };
                }

                // 拦截group方法
                if (prop === 'group') {
                    return function(groupId, traits, options, callback) {
                        log(`🚫 拦截Analytics.group调用: ${groupId}`);
                        
                        // 返回假的成功回调
                        if (typeof callback === 'function') {
                            setTimeout(() => callback(null, { success: true }), 0);
                        }
                        
                        return Promise.resolve({ success: true, intercepted: true });
                    };
                }

                // 拦截alias方法
                if (prop === 'alias') {
                    return function(userId, previousId, options, callback) {
                        log(`🚫 拦截Analytics.alias调用: ${userId} -> ${previousId}`);
                        
                        // 返回假的成功回调
                        if (typeof callback === 'function') {
                            setTimeout(() => callback(null, { success: true }), 0);
                        }
                        
                        return Promise.resolve({ success: true, intercepted: true });
                    };
                }

                // 其他方法保持原样
                return Reflect.get(target, prop, receiver);
            }
        });

        // 标记为已代理
        Object.defineProperty(proxy, '_augmentProxied', {
            value: true,
            writable: false,
            enumerable: false,
            configurable: false
        });

        return proxy;
    },

    /**
     * 拦截Segment.io相关的Analytics
     */
    interceptSegmentAnalytics() {
        // 拦截analytics全局变量（Segment.io常用）
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (globalObj.analytics && typeof globalObj.analytics === 'object') {
            log('🎯 检测到Segment analytics对象，创建安全代理...');
            globalObj.analytics = this.createAnalyticsProxy(globalObj.analytics);
        }

        // 监听analytics对象的动态创建
        Object.defineProperty(globalObj, 'analytics', {
            get: function() {
                return this._analytics;
            },
            set: function(value) {
                if (value && typeof value === 'object' && !value._augmentProxied) {
                    log('🎯 检测到新的analytics对象，创建安全代理...');
                    this._analytics = SafeAnalyticsInterceptor.createAnalyticsProxy(value);
                } else {
                    this._analytics = value;
                }
            },
            configurable: true,
            enumerable: true
        });
    }
};
