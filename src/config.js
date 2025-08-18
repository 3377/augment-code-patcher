/**
 * Augment Code Extension 安全拦截器配置中心
 * 
 * 包含所有配置项和常量定义
 */

// 主配置对象
export const INTERCEPTOR_CONFIG = {
    version: 'v2.5',
    buildTime: new Date().toISOString(),
    debugMode: true,

    // VSCode版本配置
    vscode: {
        versions: [
            '1.96.0', 
            '1.96.1',
            '1.96.2',
            '1.96.3',
            '1.96.4',
            '1.97.0',
            '1.97.1',
            '1.97.2',
            '1.98.0',
            '1.98.1',
            '1.98.2',
            '1.99.0',
            '1.99.1',
            '1.99.2',
            '1.99.3',
            '1.100.0',
            '1.100.1',
            '1.100.2',
            '1.100.3',
            '1.101.0',
            '1.101.1',
            '1.101.2',
            '1.102.0',
            '1.102.1',
            '1.102.2',
            '1.102.3',
            '1.103.1'
        ],
        fixedVersion: null,
        uriScheme: 'vscode'
    },

    // 系统信息配置
    system: null, // 将在初始化时动态生成

    // 系统信息访问计数器
    systemAccessCount: {
        platform: 0,
        arch: 0,
        hostname: 0,
        type: 0,
        release: 0,
        version: 0
    },

    // VSCode环境变量访问计数器
    vscodeEnvAccessCount: {
        uriScheme: 0,
        sessionId: 0,
        machineId: 0,
        isTelemetryEnabled: 0,
        language: 0,
        other: 0
    },
    
    // 网络拦截配置
    network: {
        enableHttpInterception: true,
        enableFetchInterception: true,
        enableXhrInterception: true,
        logInterceptions: true,
        // 被放行请求监控
        logAllowedRequests: false,  // 是否记录被放行的请求
        allowedRequestLogLimit: 1000,  // 整个原始请求包字符限制
        // 所有端点请求包打印
        logAllRequests: false,      // 是否记录所有请求（包括拦截和放行的）
        logInterceptedRequests: false,  // 是否记录被拦截的请求
        requestLogLimit: 2000      // 请求包详细日志字符限制
    },
    
    // 数据保护配置
    dataProtection: {
        enableAnalyticsBlocking: true,
        enableJsonCleaning: false, // 暂时禁用JSON拦截功能
        enableGitProtection: true,
        enableSessionIdReplacement: true,
        // 精确控制
        enablePreciseEventReporterControl: true,
        enableSmartDataClassification: true,
        enableEnhancedWhitelist: true,
        enableApiServerErrorReportInterception: true,
        enableSystemApiInterception: true,
        enableGitCommandInterception: true,
        enableVSCodeInterception: true
    }
};

// v2.5改进：更精确的拦截模式分类
export const TELEMETRY_PATTERNS = [
    // "report-feature-vector",    // 特征向量报告
    "record-session-events",    // 会话事件记录
    "report-error",            // 错误报告
    "client-metrics",          // 客户端指标
    "record-request-events",   // 请求事件记录
    "record-user-events",      // 用户操作事件
    "record-preference-sample", // 用户偏好数据
    "chat-feedback",           // 反馈
    "completion-feedback",     // 反馈
    "next-edit-feedback",      // 反馈
    "analytics",               // 分析数据
    "telemetry",              // 遥测数据
    "tracking",               // 跟踪数据
    "metrics",                // 指标数据
    "usage",                  // 使用数据
    "stats",                  // 统计数据
    "event",                  // 事件数据
    "collect",                // 收集数据
    "gather",                 // 聚集数据
    "submit",                 // 提交数据
    "track",                  // 跟踪数据
    "monitor",                // 监控数据
    "observe",                // 观察数据
    "subscription-info"       // 订阅信息
];

// 精确遥测端点模式（高优先级拦截）
export const PRECISE_TELEMETRY_ENDPOINTS = [
    "/record-session-events",      // 会话事件记录端点
    // "/report-feature-vector",      // 特征向量报告端点
    "/record-request-events",      // 请求事件记录端点
    "/record-user-events",         // 用户操作事件端点
    "/record-preference-sample",   // 用户偏好数据端点
    "/client-metrics",             // 客户端指标端点
    "/chat-feedback",              // 聊天反馈端点
    "/completion-feedback",        // 代码补全反馈端点
    "/next-edit-feedback",         // 下一步编辑反馈端点
    "/analytics",                  // 分析数据端点
    "/telemetry",                  // 遥测数据端点
    "/tracking",                   // 跟踪数据端点
    "/metrics",                    // 指标数据端点
    "/usage",                      // 使用数据端点
    "/stats",                      // 统计数据端点
    "/subscription-info",          // 订阅信息端点
    "segment.io",                  // Segment分析服务
    "api.segment.io"               // Segment API端点
];

// 必要端点白名单（最高优先级保护）
export const ESSENTIAL_ENDPOINTS = [
    "/report-feature-vector",      // 特征向量报告端点
    "batch-upload",           // 代码库索引上传
    "memorize",              // 记忆功能
    "completion",            // 代码补全
    "chat-stream",           // 聊天流
    "subscription-info",     // 订阅信息
    "get-models",           // 获取模型列表
    "token",                // 令牌相关
    "codebase-retrieval",   // 代码库检索
    "agents/",              // AI代理相关
    "remote-agents",        // 远程AI代理相关（修复list-stream错误）
    "list-stream",          // 流式列表API（远程代理概览）
    "augment-api",          // Augment API
    "augment-backend",      // Augment后端
    "workspace-context",    // 工作区上下文
    "symbol-index",         // 符号索引
    "blob-upload",          // 文件上传
    "codebase-upload",      // 代码库上传
    "file-sync",             // 文件同步
    "is-user-configured",   // 远程agent配置检查
    "list-repos"             // 远程agent仓库列表
];

// 代码索引相关模式（白名单）
export const CODE_INDEXING_PATTERNS = [
    "batch-upload",           // 代码库索引核心功能
    "codebase-retrieval",     // 代码库检索
    "file-sync",              // 文件同步
    "workspace-context",      // 工作区上下文
    "symbol-index",           // 符号索引
    "blob-upload",            // 文件上传
    "codebase-upload",        // 代码库上传
    "agents/",                // AI代理相关
    "augment-api",            // Augment API
    "augment-backend"         // Augment后端
];

// Event Reporter类型定义
export const EVENT_REPORTER_TYPES = [
    '_clientMetricsReporter',
    '_extensionEventReporter', 
    '_toolUseRequestEventReporter',
    '_nextEditSessionEventReporter',
    '_completionAcceptanceReporter',
    '_codeEditReporter',
    '_nextEditResolutionReporter',
    '_onboardingSessionEventReporter',
    '_completionTimelineReporter',
    // '_featureVectorReporter'
];

// 增强的拦截模式
export const enhancedBlockedPatterns = [
    // OAuth2认证相关
    //"oauth2", "oauth", "authorization_code", "client_credentials",
    //"token_endpoint", "auth_endpoint", "refresh_token",
    //"jwt", "bearer", "access_token",

    // Ask模式数据收集
    //"ask_mode", "question_data", "user_query", "conversation_data",

    // Bug报告功能
    "bug_report", "error_report", "crash_report", "diagnostic_data",

    // MCP工具数据传输
    //"mcp_data", "stripe_data", "sentry_data", "redis_data",

    // Segment.io 数据分析拦截
    "segment.io", "api.segment.io", "/v1/batch", "segment",
    "writeKey", "analytics.track", "analytics.identify",

    // 增强的身份追踪
    "user_id", "session_id", "anonymous_id", "device_id",
    "fingerprint", "tenant_id", "client_id"
];

// 综合拦截模式
export const INTERCEPT_PATTERNS = [...TELEMETRY_PATTERNS, ...enhancedBlockedPatterns];
