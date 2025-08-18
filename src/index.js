/**
 * Augment Code Extension v2.5 精确拦截器 - 主入口文件
 * 
 * 模块化重构版本，保持原有功能完整性
 */

// 导入配置和工具模块
import { INTERCEPTOR_CONFIG, TELEMETRY_PATTERNS, CODE_INDEXING_PATTERNS, EVENT_REPORTER_TYPES, INTERCEPT_PATTERNS } from './config.js';
import { log } from './utils/logger.js';
import { SystemInfoGenerator } from './utils/system-info-generator.js';
import { URLClassificationCache } from './utils/url-classifier.js';

// 导入核心模块
import { SessionManager } from './core/session-manager.js';
import { SmartDataClassifier } from './core/classifier.js';
import { IdentityManager } from './core/identity-manager.js';

// 导入拦截器模块
import { NetworkInterceptor } from './interceptors/network.js';
import { VSCodeInterceptor } from './interceptors/vscode.js';
import { SystemApiInterceptor } from './interceptors/system-api.js';
import { SystemCommandInterceptor } from './interceptors/system-command.js';
import { PreciseEventReporterInterceptor } from './interceptors/event-reporter.js';
import { SafeAnalyticsInterceptor } from './interceptors/analytics.js';
import { ApiServerErrorReportInterceptor } from './interceptors/api-server-error.js';
import { SmartJsonInterceptor } from './interceptors/json.js';

// IIFE包装，保持原有的执行方式
(function() {
    'use strict';

    /**
     * v2.5主初始化器
     * 按照优化后的顺序初始化所有模块
     */
    const MainInitializer = {
        /**
         * 初始化所有拦截器模块
         */
        initializeAll() {
            log('🚀 开始初始化 v2.5 精确拦截器...');

            try {
                // 0. 初始化系统信息
                this.initializeSystemInfo();

                // 1. 首先初始化智能数据分类器
                log('📊 智能数据分类器已就绪');

                // 2. 初始化精确的Event Reporter拦截
                PreciseEventReporterInterceptor.initialize();

                // 3. 初始化API服务器错误报告拦截
                ApiServerErrorReportInterceptor.initialize();

                // 4. 初始化安全的Analytics拦截
                SafeAnalyticsInterceptor.initialize();

                // 5. 初始化智能JSON拦截（暂时禁用）
                // SmartJsonInterceptor.initialize();

                // 6. 初始化系统API拦截
                SystemApiInterceptor.initialize();

                // 7. 初始化系统命令拦截
                SystemCommandInterceptor.initialize();

                // 8. 初始化VSCode拦截
                VSCodeInterceptor.initialize();

                // 9. 初始化网络拦截
                NetworkInterceptor.initializeAll();

                // 10. 设置全局配置接口
                this.setupGlobalInterface();

                log('✅ v2.5 精确拦截器初始化完成！');
                this.printStatus();

            } catch (error) {
                log(`❌ 初始化失败: ${error.message}`, 'error');
                console.error('[AugmentCode拦截器] 初始化错误详情:', error);
            }
        },

        /**
         * 初始化系统信息
         */
        initializeSystemInfo() {
            // 生成假系统信息
            const fakeSystemInfo = SystemInfoGenerator.generateFakeSystemInfo();
            
            // 将假系统信息设置到配置中
            INTERCEPTOR_CONFIG.system = fakeSystemInfo;
            
            log('🖥️ 系统信息初始化完成');
            log(`   平台: ${fakeSystemInfo.platform}/${fakeSystemInfo.arch}`);
            log(`   主机名: ${fakeSystemInfo.hostname}`);
            log(`   VSCode版本: ${fakeSystemInfo.vscodeVersion}`);
            
            // 根据平台显示特定信息
            if (fakeSystemInfo.platform === 'darwin') {
                log(`   Mac序列号: ${fakeSystemInfo.macSerial}`);
                log(`   Mac型号: ${fakeSystemInfo.macModel}`);
            } else if (fakeSystemInfo.platform === 'win32') {
                log(`   Windows产品ID: ${fakeSystemInfo.winProductId}`);
            }
        },

        /**
         * 设置全局配置接口
         */
        setupGlobalInterface() {
            // 在全局对象上暴露配置接口
            let globalObj = this;

            if (typeof global !== 'undefined') {
                globalObj = global;
            } else if (typeof window !== 'undefined') {
                globalObj = window;
            }

            globalObj.AugmentCodeInterceptor = {
                version: INTERCEPTOR_CONFIG.version,
                config: INTERCEPTOR_CONFIG,

                // 配置方法
                enableDebug: () => {
                    INTERCEPTOR_CONFIG.debugMode = true;
                    log('🔧 调试模式已启用');
                },

                disableDebug: () => {
                    INTERCEPTOR_CONFIG.debugMode = false;
                    console.log('[AugmentCode拦截器] 🔧 调试模式已禁用');
                },

                // 会话管理
                regenerateSessionIds: () => {
                    SessionManager.regenerateAll();
                },

                getSessionIds: () => ({
                    main: SessionManager.getMainSessionId(),
                    user: SessionManager.getUserId(),
                    anonymous: SessionManager.getAnonymousId()
                }),

                // 系统信息访问统计
                getSystemAccessStats: () => {
                    const stats = INTERCEPTOR_CONFIG.systemAccessCount;
                    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
                    log('📊 系统信息访问统计:');
                    log(`   os.platform(): ${stats.platform}次`);
                    log(`   os.arch(): ${stats.arch}次`);
                    log(`   os.hostname(): ${stats.hostname}次`);
                    log(`   os.type(): ${stats.type}次`);
                    log(`   os.release(): ${stats.release}次`);
                    log(`   os.version(): ${stats.version}次`);
                    log(`   总访问次数: ${total}次`);
                    return stats;
                },

                resetSystemAccessStats: () => {
                    INTERCEPTOR_CONFIG.systemAccessCount = {
                        platform: 0,
                        arch: 0,
                        hostname: 0,
                        type: 0,
                        release: 0,
                        version: 0
                    };
                    log('🔄 已重置系统信息访问统计');
                },

                // VSCode环境变量访问统计
                getVSCodeEnvAccessStats: () => {
                    const stats = INTERCEPTOR_CONFIG.vscodeEnvAccessCount;
                    const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
                    log('📊 VSCode环境变量访问统计:');
                    log(`   vscode.env.uriScheme: ${stats.uriScheme}次`);
                    log(`   vscode.env.sessionId: ${stats.sessionId}次`);
                    log(`   vscode.env.machineId: ${stats.machineId}次`);
                    log(`   vscode.env.isTelemetryEnabled: ${stats.isTelemetryEnabled}次`);
                    log(`   vscode.env.language: ${stats.language}次`);
                    log(`   其他环境变量: ${stats.other}次`);
                    log(`   总访问次数: ${total}次`);
                    return stats;
                },

                resetVSCodeEnvAccessStats: () => {
                    INTERCEPTOR_CONFIG.vscodeEnvAccessCount = {
                        uriScheme: 0,
                        sessionId: 0,
                        machineId: 0,
                        isTelemetryEnabled: 0,
                        language: 0,
                        other: 0
                    };
                    log('🔄 已重置VSCode环境变量访问统计');
                },

                // 状态查询
                getStatus: () => MainInitializer.getDetailedStatus(),

                // 测试方法
                testDataClassification: (data, context) => ({
                    isCodeIndexing: SmartDataClassifier.isCodeIndexingRelated(data, context),
                    isTelemetry: SmartDataClassifier.isTelemetryData(data, context),
                    shouldIntercept: SmartDataClassifier.shouldInterceptUpload(data, context)
                }),

                // Event Reporter拦截统计
                getInterceptionStats: () => {
                    return PreciseEventReporterInterceptor.getInterceptionStats();
                },

                // URL分类缓存统计
                getCacheStats: () => {
                    return URLClassificationCache.getStats();
                },

                printCacheStats: () => {
                    URLClassificationCache.printStats();
                },

                clearCache: () => {
                    URLClassificationCache.clear();
                },

                // VSCode版本配置管理
                vscodeVersionConfig: {
                    getStatus: () => {
                        const globalObj = (typeof global !== 'undefined') ? global :
                                         (typeof window !== 'undefined') ? window : {};
                        return globalObj._augmentVSCodeVersionConfig ?
                               globalObj._augmentVSCodeVersionConfig.getStatus() : null;
                    },
                    setFixedVersion: (version) => {
                        const globalObj = (typeof global !== 'undefined') ? global :
                                         (typeof window !== 'undefined') ? window : {};
                        return globalObj._augmentVSCodeVersionConfig ?
                               globalObj._augmentVSCodeVersionConfig.setFixedVersion(version) : false;
                    },
                    clearFixedVersion: () => {
                        const globalObj = (typeof global !== 'undefined') ? global :
                                         (typeof window !== 'undefined') ? window : {};
                        if (globalObj._augmentVSCodeVersionConfig) {
                            globalObj._augmentVSCodeVersionConfig.clearFixedVersion();
                        }
                    },
                    addVersion: (version) => {
                        const globalObj = (typeof global !== 'undefined') ? global :
                                         (typeof window !== 'undefined') ? window : {};
                        return globalObj._augmentVSCodeVersionConfig ?
                               globalObj._augmentVSCodeVersionConfig.addVersion(version) : false;
                    }
                },

                // 打印拦截统计报告
                printInterceptionReport: () => {
                    const stats = PreciseEventReporterInterceptor.getInterceptionStats();

                    console.log('\n📊 Event Reporter 拦截统计报告');
                    console.log('='.repeat(50));
                    console.log(`总拦截次数: ${stats.totalInterceptions}`);

                    if (stats.lastInterception) {
                        console.log(`最后拦截: ${stats.lastInterception.reporterType}.${stats.lastInterception.method}()`);
                        console.log(`拦截时间: ${stats.lastInterception.timestamp}`);
                    }

                    if (stats.topReporters && stats.topReporters.length > 0) {
                        console.log('\n🎯 拦截最多的Reporter:');
                        stats.topReporters.forEach(([reporter, count], index) => {
                            console.log(`  ${index + 1}. ${reporter}: ${count} 次`);
                        });
                    }

                    if (stats.topMethods && stats.topMethods.length > 0) {
                        console.log('\n🔧 拦截最多的方法:');
                        stats.topMethods.forEach(([method, count], index) => {
                            console.log(`  ${index + 1}. ${method}(): ${count} 次`);
                        });
                    }

                    console.log('='.repeat(50));
                }
            };

            log('🔧 全局配置接口已设置');
        },

        /**
         * 打印初始化状态
         */
        printStatus() {
            console.log('\n' + '='.repeat(60));
            console.log('🛡️  Augment Code 安全拦截器 v2.5 状态报告');
            console.log('='.repeat(60));
            console.log(`📅 构建时间: ${INTERCEPTOR_CONFIG.buildTime}`);
            console.log(`🔧 调试模式: ${INTERCEPTOR_CONFIG.debugMode ? '✅ 启用' : '❌ 禁用'}`);
            console.log(`🆔 主会话ID: ${SessionManager.getMainSessionId()}`);
            console.log('\n📊 功能模块状态:');
            console.log(`  🎯 精确Event Reporter拦截: ${INTERCEPTOR_CONFIG.dataProtection.enablePreciseEventReporterControl ? '✅' : '❌'}`);
            console.log(`  🚫 API错误报告拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableApiServerErrorReportInterception ? '✅' : '❌'}`);
            console.log(`  🛡️ 安全Analytics拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableAnalyticsBlocking ? '✅' : '❌'}`);
            console.log(`  🔍 智能数据分类: ${INTERCEPTOR_CONFIG.dataProtection.enableSmartDataClassification ? '✅' : '❌'}`);
            console.log(`  🖥️ 系统API拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableSystemApiInterception ? '✅' : '❌'}`);
            console.log(`  🔧 系统命令拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableGitCommandInterception ? '✅' : '❌'}`);
            console.log(`  🎭 VSCode拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableVSCodeInterception ? '✅' : '❌'}`);
            console.log(`  🌐 网络请求拦截: ${INTERCEPTOR_CONFIG.network.enableFetchInterception ? '✅' : '❌'}`);
            console.log(`  📝 智能JSON拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableJsonCleaning ? '✅' : '❌ (已禁用)'}`);
            console.log(`  🔒 增强白名单保护: ${INTERCEPTOR_CONFIG.dataProtection.enableEnhancedWhitelist ? '✅' : '❌'}`);
            console.log(`  🔍 被放行请求监控: ${INTERCEPTOR_CONFIG.network.logAllowedRequests ? '✅' : '❌'}`);
            console.log('\n🎯 拦截策略:');
            console.log(`  📊 遥测模式数量: ${TELEMETRY_PATTERNS.length}`);
            console.log(`  ✅ 代码索引白名单: ${CODE_INDEXING_PATTERNS.length}`);
            console.log(`  🎭 Event Reporter类型: ${EVENT_REPORTER_TYPES.length}`);
            console.log('\n💡 使用方法:');
            console.log('  - 查看状态: AugmentCodeInterceptor.getStatus()');
            console.log('  - 测试分类: AugmentCodeInterceptor.testDataClassification(data, context)');
            console.log('  - 重新生成ID: AugmentCodeInterceptor.regenerateSessionIds()');
            console.log('  - 系统访问统计: AugmentCodeInterceptor.getSystemAccessStats()');
            console.log('  - VSCode访问统计: AugmentCodeInterceptor.getVSCodeEnvAccessStats()');
            console.log('='.repeat(60) + '\n');
        },

        /**
         * 获取详细状态信息
         */
        getDetailedStatus() {
            return {
                version: INTERCEPTOR_CONFIG.version,
                buildTime: INTERCEPTOR_CONFIG.buildTime,
                debugMode: INTERCEPTOR_CONFIG.debugMode,
                sessionIds: {
                    main: SessionManager.getMainSessionId(),
                    user: SessionManager.getUserId(),
                    anonymous: SessionManager.getAnonymousId()
                },
                modules: {
                    preciseEventReporter: INTERCEPTOR_CONFIG.dataProtection.enablePreciseEventReporterControl,
                    apiServerErrorReportInterception: INTERCEPTOR_CONFIG.dataProtection.enableApiServerErrorReportInterception,
                    safeAnalytics: INTERCEPTOR_CONFIG.dataProtection.enableAnalyticsBlocking,
                    smartDataClassification: INTERCEPTOR_CONFIG.dataProtection.enableSmartDataClassification,
                    systemApiInterception: INTERCEPTOR_CONFIG.dataProtection.enableSystemApiInterception,
                    systemCommandInterception: INTERCEPTOR_CONFIG.dataProtection.enableGitCommandInterception,
                    vscodeInterception: INTERCEPTOR_CONFIG.dataProtection.enableVSCodeInterception,
                    networkInterception: INTERCEPTOR_CONFIG.network.enableFetchInterception,
                    smartJsonInterception: INTERCEPTOR_CONFIG.dataProtection.enableJsonCleaning,
                    enhancedWhitelist: INTERCEPTOR_CONFIG.dataProtection.enableEnhancedWhitelist
                },
                patterns: {
                    telemetryPatterns: TELEMETRY_PATTERNS.length,
                    codeIndexingPatterns: CODE_INDEXING_PATTERNS.length,
                    eventReporterTypes: EVENT_REPORTER_TYPES.length,
                    totalInterceptPatterns: INTERCEPT_PATTERNS.length
                }
            };
        }
    };

    // 立即执行初始化
    MainInitializer.initializeAll();

    // 导出主要接口（如果在模块环境中）
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            version: INTERCEPTOR_CONFIG.version,
            SmartDataClassifier,
            SessionManager,
            NetworkInterceptor,
            getStatus: () => MainInitializer.getDetailedStatus(),
            // 调试功能控制
            enableAllowedRequestLogging: () => {
                INTERCEPTOR_CONFIG.network.logAllowedRequests = true;
                console.log('[DEBUG] 被放行请求监控已启用');
            },
            disableAllowedRequestLogging: () => {
                INTERCEPTOR_CONFIG.network.logAllowedRequests = false;
                console.log('[DEBUG] 被放行请求监控已禁用');
            },
            setLogLimit: (limit) => {
                INTERCEPTOR_CONFIG.network.allowedRequestLogLimit = limit;
                console.log(`[DEBUG] 整个请求包日志长度限制设置为: ${limit}`);
            }
        };
    }

})();
