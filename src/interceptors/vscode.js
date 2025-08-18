/**
 * Augment Code Extension VSCode拦截器
 * 
 * 拦截VSCode模块，伪造版本、sessionId、machineId等信息
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log, logOnce } from '../utils/logger.js';
import { SessionManager } from '../core/session-manager.js';

/**
 * VSCode拦截器
 */
export const VSCodeInterceptor = {
    /**
     * 初始化VSCode拦截
     */
    initialize() {
        if (!INTERCEPTOR_CONFIG.dataProtection.enableVSCodeInterception) {
            return;
        }

        log('🎭 初始化VSCode拦截...');

        this.setupVersionConfig();
        this.interceptVSCodeModule();

        log('✅ VSCode拦截设置完成');
    },

    /**
     * 设置VSCode版本配置
     */
    setupVersionConfig() {
        // 设置全局VSCode版本配置
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        globalObj._augmentVSCodeVersionConfig = {
            availableVersions: [...INTERCEPTOR_CONFIG.vscode.versions],
            fixedVersion: null,

            getRandomVersion() {
                return this.availableVersions[Math.floor(Math.random() * this.availableVersions.length)];
            },

            setFixedVersion(version) {
                if (this.availableVersions.includes(version)) {
                    this.fixedVersion = version;
                    log(`🎭 已设置固定VSCode版本: ${version}`);
                    return true;
                } else {
                    log(`❌ 无效的VSCode版本: ${version}`, 'error');
                    return false;
                }
            },

            clearFixedVersion() {
                this.fixedVersion = null;
                log('🎲 已恢复随机VSCode版本模式');
            },

            getCurrentVersion() {
                return this.fixedVersion || this.getRandomVersion();
            },

            addVersion(version) {
                if (!this.availableVersions.includes(version)) {
                    this.availableVersions.push(version);
                    log(`✅ 已添加新VSCode版本: ${version}`);
                    return true;
                }
                return false;
            },

            getStatus() {
                return {
                    totalVersions: this.availableVersions.length,
                    fixedVersion: this.fixedVersion,
                    currentVersion: this.getCurrentVersion(),
                    availableVersions: [...this.availableVersions]
                };
            }
        };

        // 为当前会话设置固定版本
        const sessionVersion = globalObj._augmentVSCodeVersionConfig.getRandomVersion();
        globalObj._augmentVSCodeVersionConfig.setFixedVersion(sessionVersion);
        log(`🔒 已为当前会话设置固定VSCode版本: ${sessionVersion}`);
    },

    /**
     * 拦截VSCode模块
     */
    interceptVSCodeModule() {
        if (typeof require !== 'undefined') {
            const originalRequire = require;

            require = function(moduleName) {
                if (moduleName === 'vscode') {
                    try {
                        const vscodeModule = originalRequire.apply(this, arguments);

                        if (vscodeModule && typeof vscodeModule === 'object') {
                            logOnce('🎭 创建VSCode版本拦截代理...', 'vscode-module-intercept');
                            return VSCodeInterceptor.createVSCodeProxy(vscodeModule);
                        }

                        return vscodeModule;
                    } catch (e) {
                        log('提供VSCode模拟对象（带版本伪造）');
                        return VSCodeInterceptor.createMockVSCode();
                    }
                }

                return originalRequire.apply(this, arguments);
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
     * 创建VSCode代理对象
     * @param {Object} vscodeModule - 原始VSCode模块
     * @returns {Proxy} VSCode代理对象
     */
    createVSCodeProxy(vscodeModule) {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        const randomVSCodeVersion = globalObj._augmentVSCodeVersionConfig ?
            globalObj._augmentVSCodeVersionConfig.getCurrentVersion() :
            '1.96.0';

        return new Proxy(vscodeModule, {
            get: function(target, prop, receiver) {
                // 拦截version属性
                if (prop === 'version') {
                    const originalVersion = target[prop];
                    log(`🎭 拦截VSCode版本访问: ${originalVersion} → ${randomVSCodeVersion}`);
                    return randomVSCodeVersion;
                }

                // 拦截env对象
                if (prop === 'env') {
                    const originalEnv = target[prop];
                    if (originalEnv && typeof originalEnv === 'object') {
                        return VSCodeInterceptor.createEnvProxy(originalEnv);
                    }
                    return originalEnv;
                }

                return Reflect.get(target, prop, receiver);
            }
        });
    },

    /**
     * 创建env对象代理
     * @param {Object} originalEnv - 原始env对象
     * @returns {Proxy} env代理对象
     */
    createEnvProxy(originalEnv) {
        return new Proxy(originalEnv, {
            get: function(envTarget, envProp, envReceiver) {
                if (envProp === 'uriScheme') {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme++;
                    const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                    const fakeValue = 'vscode';

                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme === 1) {
                        logOnce('🎭 拦截VSCode URI方案访问', 'vscode-uri-scheme-intercept');
                        logOnce(`📋 原始值: ${originalValue} → 伪造值: ${fakeValue}`, 'vscode-uri-scheme-values');
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme % 10 === 0) {
                        log(`🎭 拦截VSCode URI方案访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme}次)`);
                    }
                    return fakeValue;
                }

                if (envProp === 'sessionId') {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId++;
                    const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                    const fakeValue = SessionManager.getMainSessionId();

                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId === 1) {
                        logOnce('🎭 拦截VSCode会话ID访问', 'vscode-session-id-intercept');
                        logOnce(`📋 原始sessionId: ${originalValue}`, 'vscode-session-id-original');
                        logOnce(`📋 伪造sessionId: ${fakeValue}`, 'vscode-session-id-fake');
                        log('✅ 成功替换会话ID');
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId % 10 === 0) {
                        log(`🎭 拦截VSCode会话ID访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId}次)`);
                    }
                    return fakeValue;
                }

                if (envProp === 'machineId') {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId++;
                    const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                    const fakeValue = INTERCEPTOR_CONFIG.system.machineId;

                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId === 1) {
                        logOnce('🎭 拦截VSCode机器ID访问', 'vscode-machine-id-intercept');
                        logOnce(`📋 原始machineId: ${originalValue}`, 'vscode-machine-id-original');
                        logOnce(`📋 伪造machineId: ${fakeValue}`, 'vscode-machine-id-fake');
                        log('✅ 成功替换机器ID');
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId % 10 === 0) {
                        log(`🎭 拦截VSCode机器ID访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId}次)`);
                    }
                    return fakeValue;
                }

                // 强制禁用遥测功能
                if (envProp === 'isTelemetryEnabled') {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled++;
                    const originalValue = Reflect.get(envTarget, envProp, envReceiver);

                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled === 1) {
                        logOnce('🎭 拦截VSCode遥测状态访问', 'vscode-telemetry-intercept');
                        logOnce(`📋 原始isTelemetryEnabled: ${originalValue}`, 'vscode-telemetry-original');
                        logOnce('📋 强制设置isTelemetryEnabled: false', 'vscode-telemetry-fake');
                        log('✅ 成功禁用遥测功能');
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled % 10 === 0) {
                        log(`🎭 拦截VSCode遥测状态访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled}次)`);
                    }
                    return false;
                }

                // 统一语言环境
                if (envProp === 'language') {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language++;
                    const originalValue = Reflect.get(envTarget, envProp, envReceiver);

                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language === 1) {
                        logOnce('🎭 拦截VSCode语言环境访问', 'vscode-language-intercept');
                        logOnce(`📋 原始language: ${originalValue}`, 'vscode-language-original');
                        logOnce('📋 强制设置language: en-US', 'vscode-language-fake');
                        log('✅ 成功统一语言环境');
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language % 10 === 0) {
                        log(`🎭 拦截VSCode语言环境访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language}次)`);
                    }
                    return 'en-US';
                }

                // 打印其他环境变量访问（用于调试）
                const value = Reflect.get(envTarget, envProp, envReceiver);
                if (typeof envProp === 'string' && !envProp.startsWith('_')) {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount.other++;
                    if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.other === 1) {
                        log(`📊 VSCode env访问: ${envProp} = ${value}`);
                    } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.other % 5 === 0) {
                        log(`📊 VSCode env访问: ${envProp} = ${value} (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.other}次其他访问)`);
                    }
                }
                return value;
            }
        });
    },

    /**
     * 创建模拟VSCode对象
     * @returns {Object} 模拟的VSCode对象
     */
    createMockVSCode() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        const randomVSCodeVersion = globalObj._augmentVSCodeVersionConfig ?
            globalObj._augmentVSCodeVersionConfig.getCurrentVersion() :
            '1.96.0';

        return {
            version: randomVSCodeVersion,
            commands: { registerCommand: () => ({}) },
            window: {
                showInformationMessage: () => Promise.resolve(),
                showErrorMessage: () => Promise.resolve(),
                createOutputChannel: () => ({
                    appendLine: () => {},
                    show: () => {},
                    dispose: () => {}
                })
            },
            workspace: {
                getConfiguration: () => ({
                    get: () => undefined,
                    has: () => false,
                    inspect: () => undefined,
                    update: () => Promise.resolve()
                })
            },
            authentication: {
                getSession: () => Promise.resolve(null),
                onDidChangeSessions: { dispose: () => {} }
            },
            env: new Proxy({
                uriScheme: 'vscode',
                sessionId: SessionManager.getMainSessionId(),
                machineId: INTERCEPTOR_CONFIG.system.machineId,
                isTelemetryEnabled: false,
                language: 'en-US'
            }, {
                get: function(target, prop, receiver) {
                    const value = Reflect.get(target, prop, receiver);
                    if (prop === 'sessionId') {
                        log('🎭 模拟VSCode对象 - 访问sessionId');
                        log(`📋 返回伪造sessionId: ${value}`);
                    } else if (prop === 'machineId') {
                        log('🎭 模拟VSCode对象 - 访问machineId');
                        log(`📋 返回伪造machineId: ${value}`);
                    } else if (prop === 'uriScheme') {
                        log('🎭 模拟VSCode对象 - 访问uriScheme');
                        log(`📋 返回伪造uriScheme: ${value}`);
                    } else if (prop === 'isTelemetryEnabled') {
                        log('🎭 模拟VSCode对象 - 访问isTelemetryEnabled');
                        log('📋 强制返回isTelemetryEnabled: false');
                    } else if (prop === 'language') {
                        log('🎭 模拟VSCode对象 - 访问language');
                        log('📋 强制返回language: en-US');
                    }
                    return value;
                }
            })
        };
    }
};
