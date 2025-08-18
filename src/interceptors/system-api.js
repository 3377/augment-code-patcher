/**
 * Augment Code Extension 系统API拦截器
 * 
 * 拦截process对象和os模块，返回假系统信息
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log, logOnce } from '../utils/logger.js';

/**
 * 系统API拦截器
 */
export const SystemApiInterceptor = {
    /**
     * 初始化系统API拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enableSystemApiInterception) {
            return;
        }

        log('🖥️ 初始化系统API拦截...');

        this.interceptProcessObject();
        this.interceptOSModule();

        log('✅ 系统API拦截设置完成');
    },

    /**
     * 拦截process对象
     */
    interceptProcessObject() {
        if (typeof process !== 'undefined') {
            // 拦截 process.platform
            if (process.platform) {
                Object.defineProperty(process, 'platform', {
                    get: function() {
                        return INTERCEPTOR_CONFIG.system.platform;
                    },
                    configurable: true,
                    enumerable: true
                });
                log(`🎭 已拦截 process.platform: ${INTERCEPTOR_CONFIG.system.platform}`);
            }

            // 拦截 process.arch
            if (process.arch) {
                Object.defineProperty(process, 'arch', {
                    get: function() {
                        return INTERCEPTOR_CONFIG.system.arch;
                    },
                    configurable: true,
                    enumerable: true
                });
                log(`🎭 已拦截 process.arch: ${INTERCEPTOR_CONFIG.system.arch}`);
            }
        }
    },

    /**
     * 拦截OS模块
     */
    interceptOSModule() {
        // 拦截require('os')
        if (typeof require !== 'undefined') {
            const originalRequire = require;

            require = function(moduleName) {
                const module = originalRequire.apply(this, arguments);

                if (moduleName === 'os') {
                    logOnce('🖥️ 拦截OS模块...', 'os-module-intercept');
                    return SystemApiInterceptor.createOSProxy(module);
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
    },

    /**
     * 创建OS模块代理
     * @param {Object} originalOS - 原始OS模块
     * @returns {Proxy} OS模块代理
     */
    createOSProxy(originalOS) {
        return new Proxy(originalOS, {
            get(target, prop) {
                switch (prop) {
                    case 'platform':
                        return function() {
                            INTERCEPTOR_CONFIG.systemAccessCount.platform++;
                            if (INTERCEPTOR_CONFIG.systemAccessCount.platform === 1) {
                                log(`🎭 拦截 os.platform(): ${INTERCEPTOR_CONFIG.system.platform}`);
                            } else if (INTERCEPTOR_CONFIG.systemAccessCount.platform % 10 === 0) {
                                log(`🎭 拦截 os.platform(): ${INTERCEPTOR_CONFIG.system.platform} (第${INTERCEPTOR_CONFIG.systemAccessCount.platform}次访问)`);
                            }
                            return INTERCEPTOR_CONFIG.system.platform;
                        };
                    case 'arch':
                        return function() {
                            INTERCEPTOR_CONFIG.systemAccessCount.arch++;
                            if (INTERCEPTOR_CONFIG.systemAccessCount.arch === 1) {
                                log(`🎭 拦截 os.arch(): ${INTERCEPTOR_CONFIG.system.arch}`);
                            } else if (INTERCEPTOR_CONFIG.systemAccessCount.arch % 10 === 0) {
                                log(`🎭 拦截 os.arch(): ${INTERCEPTOR_CONFIG.system.arch} (第${INTERCEPTOR_CONFIG.systemAccessCount.arch}次访问)`);
                            }
                            return INTERCEPTOR_CONFIG.system.arch;
                        };
                    case 'hostname':
                        return function() {
                            INTERCEPTOR_CONFIG.systemAccessCount.hostname++;
                            if (INTERCEPTOR_CONFIG.systemAccessCount.hostname === 1) {
                                log(`🎭 拦截 os.hostname(): ${INTERCEPTOR_CONFIG.system.hostname}`);
                            } else if (INTERCEPTOR_CONFIG.systemAccessCount.hostname % 10 === 0) {
                                log(`🎭 拦截 os.hostname(): ${INTERCEPTOR_CONFIG.system.hostname} (第${INTERCEPTOR_CONFIG.systemAccessCount.hostname}次访问)`);
                            }
                            return INTERCEPTOR_CONFIG.system.hostname;
                        };
                    case 'type':
                        return function() {
                            INTERCEPTOR_CONFIG.systemAccessCount.type++;
                            if (INTERCEPTOR_CONFIG.systemAccessCount.type === 1) {
                                log(`🎭 拦截 os.type(): ${INTERCEPTOR_CONFIG.system.type}`);
                            } else if (INTERCEPTOR_CONFIG.systemAccessCount.type % 10 === 0) {
                                log(`🎭 拦截 os.type(): ${INTERCEPTOR_CONFIG.system.type} (第${INTERCEPTOR_CONFIG.systemAccessCount.type}次访问)`);
                            }
                            return INTERCEPTOR_CONFIG.system.type;
                        };
                    case 'release':
                    case 'version':
                        return function() {
                            const countKey = prop === 'release' ? 'release' : 'version';
                            INTERCEPTOR_CONFIG.systemAccessCount[countKey]++;
                            if (INTERCEPTOR_CONFIG.systemAccessCount[countKey] === 1) {
                                log(`🎭 拦截 os.${prop}(): ${INTERCEPTOR_CONFIG.system.version}`);
                            } else if (INTERCEPTOR_CONFIG.systemAccessCount[countKey] % 10 === 0) {
                                log(`🎭 拦截 os.${prop}(): ${INTERCEPTOR_CONFIG.system.version} (第${INTERCEPTOR_CONFIG.systemAccessCount[countKey]}次访问)`);
                            }
                            return INTERCEPTOR_CONFIG.system.version;
                        };
                    default:
                        return target[prop];
                }
            }
        });
    }
};
