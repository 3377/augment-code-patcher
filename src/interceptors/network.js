/**
 * Augment Code Extension 网络拦截器 - 完整版
 *
 * 拦截HTTP/HTTPS/Fetch/XMLHttpRequest/Axios请求
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log } from '../utils/logger.js';
import { shouldInterceptUrl } from '../utils/url-classifier.js';
import { SmartDataClassifier } from '../core/classifier.js';
import { SessionManager } from '../core/session-manager.js';

/**
 * 网络拦截器 - 完整版
 */
export const NetworkInterceptor = {
    /**
     * 记录所有请求的详细信息（包括拦截和放行的）
     */
    logRequestDetails(url, method = 'GET', body = null, options = {}, action = 'UNKNOWN', reason = '', response = null) {
        if (!INTERCEPTOR_CONFIG.network.logAllRequests) return;

        const timestamp = new Date().toISOString();
        const limit = INTERCEPTOR_CONFIG.network.requestLogLimit;

        // 根据动作类型选择不同的图标和颜色
        let actionIcon = '';
        let actionColor = '';
        switch (action) {
            case 'INTERCEPTED':
                actionIcon = '🚫';
                actionColor = '拦截';
                break;
            case 'ALLOWED':
                actionIcon = '✅';
                actionColor = '放行';
                break;
            case 'PROTECTED':
                actionIcon = '🛡️';
                actionColor = '保护';
                break;
            default:
                actionIcon = '❓';
                actionColor = '未知';
        }

        // 构建完整的原始请求包信息
        let requestPackage = `\n=== ${actionIcon} 网络请求${actionColor} ===\n`;
        requestPackage += `时间: ${timestamp}\n`;
        requestPackage += `原因: ${reason}\n`;
        requestPackage += `方法: ${method}\n`;
        requestPackage += `URL: ${url}\n`;

        // 添加Headers信息
        if (options.headers) {
            requestPackage += `\n--- 请求头 ---\n`;
            if (typeof options.headers === 'object') {
                if (options.headers instanceof Headers) {
                    for (const [key, value] of options.headers.entries()) {
                        requestPackage += `${key}: ${value}\n`;
                    }
                } else {
                    for (const [key, value] of Object.entries(options.headers)) {
                        requestPackage += `${key}: ${value}\n`;
                    }
                }
            } else {
                requestPackage += `Headers: [Headers对象存在但无法解析]\n`;
            }
        }

        // 添加请求体信息
        if (body) {
            requestPackage += `\n--- 请求体 ---\n`;
            let bodyString = '';
            if (typeof body === 'string') {
                bodyString = body;
            } else if (body instanceof FormData) {
                bodyString = '[FormData - 无法显示内容]';
                try {
                    const keys = Array.from(body.keys());
                    if (keys.length > 0) {
                        bodyString += `\nFormData键: ${keys.join(', ')}`;
                    }
                } catch (e) {
                    bodyString += '\n[无法获取FormData键]';
                }
            } else if (body instanceof URLSearchParams) {
                bodyString = body.toString();
            } else if (body instanceof ArrayBuffer || body instanceof Uint8Array) {
                bodyString = `[二进制数据 - 大小: ${body.byteLength || body.length} 字节]`;
            } else {
                try {
                    bodyString = JSON.stringify(body, null, 2);
                } catch (e) {
                    bodyString = `[复杂对象 - 无法序列化: ${e.message}]`;
                }
            }
            requestPackage += bodyString;
        } else {
            requestPackage += `\n--- 请求体 ---\n[无请求体]`;
        }

        // 添加响应包信息
        if (response) {
            requestPackage += `\n--- 响应信息 ---\n`;
            try {
                if (typeof response === 'object') {
                    if (response.status !== undefined) {
                        requestPackage += `状态码: ${response.status}\n`;
                    }
                    if (response.statusText !== undefined) {
                        requestPackage += `状态文本: ${response.statusText}\n`;
                    }
                    if (response.ok !== undefined) {
                        requestPackage += `请求成功: ${response.ok}\n`;
                    }

                    if (response.headers) {
                        requestPackage += `\n--- 响应头 ---\n`;
                        if (response.headers instanceof Headers) {
                            for (const [key, value] of response.headers.entries()) {
                                requestPackage += `${key}: ${value}\n`;
                            }
                        } else if (typeof response.headers === 'object') {
                            for (const [key, value] of Object.entries(response.headers)) {
                                requestPackage += `${key}: ${value}\n`;
                            }
                        }
                    }

                    if (response._responseText || response.responseText) {
                        const responseText = response._responseText || response.responseText;
                        requestPackage += `\n--- 响应体 ---\n${responseText}\n`;
                    } else if (response._jsonData) {
                        requestPackage += `\n--- 响应体 (JSON) ---\n${JSON.stringify(response._jsonData, null, 2)}\n`;
                    }
                } else if (typeof response === 'string') {
                    requestPackage += `响应内容: ${response}\n`;
                } else {
                    requestPackage += `响应类型: ${typeof response}\n`;
                    requestPackage += `响应内容: ${String(response).substring(0, 200)}${String(response).length > 200 ? '...' : ''}\n`;
                }
            } catch (e) {
                requestPackage += `[响应解析失败: ${e.message}]\n`;
            }
        } else {
            requestPackage += `\n--- 响应信息 ---\n[无响应数据或响应未记录]`;
        }

        requestPackage += `\n=== 请求${actionColor}结束 ===\n`;

        const truncatedPackage = requestPackage.length > limit ?
            requestPackage.substring(0, limit) + '\n...[请求包过长，已截断]' : requestPackage;

        console.log(truncatedPackage);
    },

    /**
     * 记录被放行的请求（调试功能）
     */
    logAllowedRequest(url, method = 'GET', body = null, options = {}) {
        if (!INTERCEPTOR_CONFIG.network.logAllowedRequests) return;
        this.logRequestDetails(url, method, body, options, 'ALLOWED', '通过白名单检查');
    },

    /**
     * 初始化所有网络拦截
     */
    initializeAll() {
        if (INTERCEPTOR_CONFIG.network.enableHttpInterception) {
            this.interceptHttp();
        }
        if (INTERCEPTOR_CONFIG.network.enableFetchInterception) {
            this.interceptFetchDecrypted();
            log('✅ 已启用Fetch拦截');
        }
        if (INTERCEPTOR_CONFIG.network.enableXhrInterception) {
            this.interceptXHRDecrypted();
            log('✅ 已启用XMLHttpRequest拦截');
        }

        if (INTERCEPTOR_CONFIG.network.enableHttpInterception ||
            INTERCEPTOR_CONFIG.network.enableFetchInterception ||
            INTERCEPTOR_CONFIG.network.enableXhrInterception) {
            this.interceptAxios();
            log('✅ 已启用Axios拦截');
        }

        log('🌐 网络拦截模块初始化完成');
    },

    /**
     * 创建模拟Fetch响应
     */
    createMockFetchResponse() {
        const mockData = { success: true, intercepted: true, timestamp: new Date().toISOString() };
        const mockText = JSON.stringify(mockData);

        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Map([
                ['content-type', 'application/json'],
                ['x-intercepted', 'true'],
                ['x-interceptor-version', 'v2.5']
            ]),
            json: () => Promise.resolve(mockData),
            text: () => Promise.resolve(mockText),
            blob: () => Promise.resolve(new Blob([mockText], { type: 'application/json' })),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(2)),
            clone: function() { return this; },
            _jsonData: mockData,
            _responseText: mockText
        };
    },

    /**
     * v2.5改进：更智能的Fetch拦截（解密版）
     */
    interceptFetchDecrypted() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (globalObj.fetch) {
            const originalFetch = globalObj.fetch;

            globalObj.fetch = function(url, options = {}) {
                const urlString = url.toString();
                const method = options.method || 'GET';

                // 使用智能数据分类并记录详细日志
                if (SmartDataClassifier.shouldInterceptUpload(options.body || '', urlString)) {
                    const mockResponse = NetworkInterceptor.createMockFetchResponse();

                    NetworkInterceptor.logRequestDetails(
                        urlString, method, options.body, options,
                        'INTERCEPTED', '智能拦截 - 识别为遥测数据', mockResponse
                    );
                    log(`🚫 智能拦截Fetch请求: ${urlString}`);
                    return Promise.resolve(mockResponse);
                }

                // 专门拦截 Segment.io 数据收集端点
                if (urlString.includes('segment.io') ||
                    urlString.includes('api.segment.io') ||
                    urlString.includes('/v1/batch') ||
                    urlString.includes('/v1/track')) {

                    const segmentResponse = NetworkInterceptor.createMockFetchResponse();

                    NetworkInterceptor.logRequestDetails(
                        urlString, method, options.body, options,
                        'INTERCEPTED', 'Segment.io数据收集拦截', segmentResponse
                    );
                    log(`🚫 阻止 Segment.io Fetch请求: ${urlString}`);
                    return Promise.resolve(segmentResponse);
                }

                // 检查URL是否需要拦截
                if (shouldInterceptUrl(urlString, options.body || '')) {
                    const mockResponse = NetworkInterceptor.createMockFetchResponse();

                    NetworkInterceptor.logRequestDetails(
                        urlString, method, options.body, options,
                        'INTERCEPTED', 'URL模式匹配拦截', mockResponse
                    );
                    log(`🚫 拦截Fetch请求: ${urlString}`);
                    return Promise.resolve(mockResponse);
                }

                // 会话ID替换
                if (options.headers) {
                    SessionManager.replaceSessionIds(options.headers);
                }

                // 记录被放行的请求详情
                let allowReason = '通过所有拦截检查';
                if (SmartDataClassifier.isEssentialEndpoint(urlString)) {
                    allowReason = '必要端点保护';
                } else if (SmartDataClassifier.isCodeIndexingRelated('', urlString)) {
                    allowReason = '代码索引功能';
                }

                NetworkInterceptor.logRequestDetails(
                    urlString, method, options.body, options,
                    'ALLOWED', allowReason
                );

                // 执行原始请求
                return originalFetch.apply(this, arguments);
            };

            log('✅ Fetch拦截设置完成（解密版）');
        }
    },

    /**
     * XMLHttpRequest拦截（解密版）
     */
    interceptXHRDecrypted() {
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (globalObj.XMLHttpRequest) {
            const OriginalXHR = globalObj.XMLHttpRequest;

            globalObj.XMLHttpRequest = function() {
                const xhr = new OriginalXHR();
                const originalOpen = xhr.open;
                const originalSend = xhr.send;

                xhr.open = function(method, url, async, user, password) {
                    this._method = method;
                    this._url = url;

                    // 使用智能数据分类检查
                    if (SmartDataClassifier.shouldInterceptUpload('', url)) {
                        NetworkInterceptor.logRequestDetails(
                            url, method, null, {},
                            'INTERCEPTED', '智能拦截 - XMLHttpRequest识别为遥测数据'
                        );
                        log(`🚫 智能拦截XMLHttpRequest: ${url}`);
                        NetworkInterceptor.createMockXHRResponse(this);
                        return;
                    }

                    // 专门拦截 Segment.io 数据收集端点
                    if (url.includes('segment.io') || url.includes('api.segment.io') ||
                        url.includes('/v1/batch') || url.includes('/v1/track')) {
                        NetworkInterceptor.logRequestDetails(
                            url, method, null, {},
                            'INTERCEPTED', 'Segment.io数据收集拦截 - XMLHttpRequest'
                        );
                        log(`🚫 阻止 Segment.io XMLHttpRequest: ${url}`);
                        NetworkInterceptor.createMockXHRResponse(this);
                        return;
                    }

                    if (shouldInterceptUrl(url)) {
                        NetworkInterceptor.logRequestDetails(
                            url, method, null, {},
                            'INTERCEPTED', 'URL模式匹配拦截 - XMLHttpRequest'
                        );
                        log(`🚫 拦截XMLHttpRequest: ${url}`);
                        NetworkInterceptor.createMockXHRResponse(this);
                        return;
                    }

                    // 记录被放行的请求详情
                    let allowReason = '通过所有拦截检查 - XMLHttpRequest';
                    if (SmartDataClassifier.isEssentialEndpoint(url)) {
                        allowReason = '必要端点保护 - XMLHttpRequest';
                    } else if (SmartDataClassifier.isCodeIndexingRelated('', url)) {
                        allowReason = '代码索引功能 - XMLHttpRequest';
                    }

                    NetworkInterceptor.logRequestDetails(
                        url, method, null, {},
                        'ALLOWED', allowReason
                    );

                    return originalOpen.apply(this, arguments);
                };

                return xhr;
            };

            log('✅ XMLHttpRequest拦截设置完成（解密版）');
        }
    },

    /**
     * 创建模拟XMLHttpRequest响应
     */
    createMockXHRResponse(xhr) {
        Object.defineProperty(xhr, "readyState", {value: 4, writable: false});
        Object.defineProperty(xhr, "status", {value: 200, writable: false});
        Object.defineProperty(xhr, "statusText", {value: "OK", writable: false});
        Object.defineProperty(xhr, "responseText", {value: "{}", writable: false});
        Object.defineProperty(xhr, "response", {value: "{}", writable: false});

        setTimeout(() => {
            if (typeof xhr.onreadystatechange === 'function') {
                xhr.onreadystatechange();
            }
            if (typeof xhr.onload === 'function') {
                xhr.onload();
            }
        }, 0);
    },

    /**
     * Axios拦截
     */
    interceptAxios() {
        // 拦截require调用以捕获Axios模块
        const globalObj = (typeof global !== 'undefined') ? global :
                         (typeof window !== 'undefined') ? window : this;

        if (globalObj.require) {
            const originalRequire = globalObj.require;

            globalObj.require = function(moduleName) {
                const module = originalRequire.apply(this, arguments);

                // 拦截Axios模块
                if (moduleName === "axios" && module && module.interceptors && module.interceptors.request) {
                    module.interceptors.request.use(
                        function(config) {
                            const url = config.url || '';
                            const method = config.method || 'GET';

                            // 使用智能数据分类并记录详细日志
                            if (SmartDataClassifier.shouldInterceptUpload(config.data || '', url)) {
                                NetworkInterceptor.logRequestDetails(
                                    url, method, config.data, config,
                                    'INTERCEPTED', '智能拦截 - Axios识别为遥测数据'
                                );
                                log(`🚫 智能拦截Axios请求: ${method} ${url}`);

                                config.adapter = function() {
                                    return Promise.resolve({
                                        data: {},
                                        status: 200,
                                        statusText: "OK",
                                        headers: {"content-type": "application/json"},
                                        config: config
                                    });
                                };
                                return config;
                            }

                            // 检查URL是否需要拦截
                            if (shouldInterceptUrl(url)) {
                                NetworkInterceptor.logRequestDetails(
                                    url, method, config.data, config,
                                    'INTERCEPTED', 'URL模式匹配拦截 - Axios'
                                );
                                log(`🚫 拦截Axios请求: ${url}`);

                                config.adapter = function() {
                                    return Promise.resolve({
                                        data: {},
                                        status: 200,
                                        statusText: "OK",
                                        headers: {"content-type": "application/json"},
                                        config: config
                                    });
                                };
                                return config;
                            }

                            // 会话ID替换
                            if (config.headers) {
                                SessionManager.replaceSessionIds(config.headers);
                            }

                            // 记录被放行的请求
                            let allowReason = '通过所有拦截检查 - Axios';
                            if (SmartDataClassifier.isEssentialEndpoint(url)) {
                                allowReason = '必要端点保护 - Axios';
                            } else if (SmartDataClassifier.isCodeIndexingRelated(config.data || '', url)) {
                                allowReason = '代码索引功能 - Axios';
                            }

                            NetworkInterceptor.logRequestDetails(
                                url, method, config.data, config,
                                'ALLOWED', allowReason
                            );

                            return config;
                        },
                        function(error) {
                            return Promise.reject(error);
                        }
                    );
                }

                return module;
            };
        }
    },

    /**
     * HTTP/HTTPS拦截（Node.js环境）
     */
    interceptHttp() {
        try {
            const http = require('http');
            const https = require('https');

            // HTTP拦截
            const originalHttpRequest = http.request;
            http.request = function(options, callback) {
                const url = NetworkInterceptor.buildUrlFromOptions(options);

                if (shouldInterceptUrl(url)) {
                    log(`🚫 拦截HTTP请求: ${url}`);
                    return NetworkInterceptor.createMockResponse(callback);
                }

                return originalHttpRequest.apply(this, arguments);
            };

            // HTTPS拦截
            const originalHttpsRequest = https.request;
            https.request = function(options, callback) {
                const url = NetworkInterceptor.buildUrlFromOptions(options);

                if (shouldInterceptUrl(url)) {
                    log(`🚫 拦截HTTPS请求: ${url}`);
                    return NetworkInterceptor.createMockResponse(callback);
                }

                return originalHttpsRequest.apply(this, arguments);
            };

            log('✅ HTTP/HTTPS拦截设置完成');
        } catch (e) {
            log(`HTTP/HTTPS拦截设置失败: ${e.message}`, 'error');
        }
    },

    /**
     * 从选项构建URL
     */
    buildUrlFromOptions(options) {
        if (typeof options === 'string') {
            return options;
        }

        const protocol = options.protocol || 'http:';
        const hostname = options.hostname || options.host || 'localhost';
        const port = options.port ? `:${options.port}` : '';
        const path = options.path || '/';

        return `${protocol}//${hostname}${port}${path}`;
    },

    /**
     * 创建模拟HTTP响应
     */
    createMockResponse(callback) {
        const mockResponse = {
            statusCode: 200,
            headers: { 'content-type': 'application/json' },
            on: function(event, handler) {
                if (event === 'data') {
                    setTimeout(() => handler('{}'), 0);
                } else if (event === 'end') {
                    setTimeout(handler, 0);
                }
            }
        };

        if (callback) {
            setTimeout(() => callback(mockResponse), 0);
        }

        return {
            on: () => {},
            write: () => {},
            end: () => {}
        };
    }
};