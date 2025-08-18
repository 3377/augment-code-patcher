(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // src/config.js
  var INTERCEPTOR_CONFIG, TELEMETRY_PATTERNS, PRECISE_TELEMETRY_ENDPOINTS, ESSENTIAL_ENDPOINTS, CODE_INDEXING_PATTERNS, EVENT_REPORTER_TYPES, enhancedBlockedPatterns, INTERCEPT_PATTERNS;
  var init_config = __esm({
    "src/config.js"() {
      INTERCEPTOR_CONFIG = {
        version: "v2.5",
        buildTime: (/* @__PURE__ */ new Date()).toISOString(),
        debugMode: true,
        // VSCode版本配置
        vscode: {
          versions: [
            "1.96.0",
            "1.96.1",
            "1.96.2",
            "1.96.3",
            "1.96.4",
            "1.97.0",
            "1.97.1",
            "1.97.2",
            "1.98.0",
            "1.98.1",
            "1.98.2",
            "1.99.0",
            "1.99.1",
            "1.99.2",
            "1.99.3",
            "1.100.0",
            "1.100.1",
            "1.100.2",
            "1.100.3",
            "1.101.0",
            "1.101.1",
            "1.101.2",
            "1.102.0",
            "1.102.1",
            "1.102.2",
            "1.102.3",
            "1.103.1"
          ],
          fixedVersion: null,
          uriScheme: "vscode"
        },
        // 系统信息配置
        system: null,
        // 将在初始化时动态生成
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
          logAllowedRequests: false,
          // 是否记录被放行的请求
          allowedRequestLogLimit: 1e3,
          // 整个原始请求包字符限制
          // 所有端点请求包打印
          logAllRequests: false,
          // 是否记录所有请求（包括拦截和放行的）
          logInterceptedRequests: false,
          // 是否记录被拦截的请求
          requestLogLimit: 2e3
          // 请求包详细日志字符限制
        },
        // 数据保护配置
        dataProtection: {
          enableAnalyticsBlocking: true,
          enableJsonCleaning: false,
          // 暂时禁用JSON拦截功能
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
      TELEMETRY_PATTERNS = [
        // "report-feature-vector",    // 特征向量报告
        "record-session-events",
        // 会话事件记录
        "report-error",
        // 错误报告
        "client-metrics",
        // 客户端指标
        "record-request-events",
        // 请求事件记录
        "record-user-events",
        // 用户操作事件
        "record-preference-sample",
        // 用户偏好数据
        "chat-feedback",
        // 反馈
        "completion-feedback",
        // 反馈
        "next-edit-feedback",
        // 反馈
        "analytics",
        // 分析数据
        "telemetry",
        // 遥测数据
        "tracking",
        // 跟踪数据
        "metrics",
        // 指标数据
        "usage",
        // 使用数据
        "stats",
        // 统计数据
        "event",
        // 事件数据
        "collect",
        // 收集数据
        "gather",
        // 聚集数据
        "submit",
        // 提交数据
        "track",
        // 跟踪数据
        "monitor",
        // 监控数据
        "observe",
        // 观察数据
        "subscription-info"
        // 订阅信息
      ];
      PRECISE_TELEMETRY_ENDPOINTS = [
        "/record-session-events",
        // 会话事件记录端点
        // "/report-feature-vector",      // 特征向量报告端点
        "/record-request-events",
        // 请求事件记录端点
        "/record-user-events",
        // 用户操作事件端点
        "/record-preference-sample",
        // 用户偏好数据端点
        "/client-metrics",
        // 客户端指标端点
        "/chat-feedback",
        // 聊天反馈端点
        "/completion-feedback",
        // 代码补全反馈端点
        "/next-edit-feedback",
        // 下一步编辑反馈端点
        "/analytics",
        // 分析数据端点
        "/telemetry",
        // 遥测数据端点
        "/tracking",
        // 跟踪数据端点
        "/metrics",
        // 指标数据端点
        "/usage",
        // 使用数据端点
        "/stats",
        // 统计数据端点
        "/subscription-info",
        // 订阅信息端点
        "segment.io",
        // Segment分析服务
        "api.segment.io"
        // Segment API端点
      ];
      ESSENTIAL_ENDPOINTS = [
        "/report-feature-vector",
        // 特征向量报告端点
        "batch-upload",
        // 代码库索引上传
        "memorize",
        // 记忆功能
        "completion",
        // 代码补全
        "chat-stream",
        // 聊天流
        "subscription-info",
        // 订阅信息
        "get-models",
        // 获取模型列表
        "token",
        // 令牌相关
        "codebase-retrieval",
        // 代码库检索
        "agents/",
        // AI代理相关
        "remote-agents",
        // 远程AI代理相关（修复list-stream错误）
        "list-stream",
        // 流式列表API（远程代理概览）
        "augment-api",
        // Augment API
        "augment-backend",
        // Augment后端
        "workspace-context",
        // 工作区上下文
        "symbol-index",
        // 符号索引
        "blob-upload",
        // 文件上传
        "codebase-upload",
        // 代码库上传
        "file-sync",
        // 文件同步
        "is-user-configured",
        // 远程agent配置检查
        "list-repos"
        // 远程agent仓库列表
      ];
      CODE_INDEXING_PATTERNS = [
        "batch-upload",
        // 代码库索引核心功能
        "codebase-retrieval",
        // 代码库检索
        "file-sync",
        // 文件同步
        "workspace-context",
        // 工作区上下文
        "symbol-index",
        // 符号索引
        "blob-upload",
        // 文件上传
        "codebase-upload",
        // 代码库上传
        "agents/",
        // AI代理相关
        "augment-api",
        // Augment API
        "augment-backend"
        // Augment后端
      ];
      EVENT_REPORTER_TYPES = [
        "_clientMetricsReporter",
        "_extensionEventReporter",
        "_toolUseRequestEventReporter",
        "_nextEditSessionEventReporter",
        "_completionAcceptanceReporter",
        "_codeEditReporter",
        "_nextEditResolutionReporter",
        "_onboardingSessionEventReporter",
        "_completionTimelineReporter"
        // '_featureVectorReporter'
      ];
      enhancedBlockedPatterns = [
        // OAuth2认证相关
        //"oauth2", "oauth", "authorization_code", "client_credentials",
        //"token_endpoint", "auth_endpoint", "refresh_token",
        //"jwt", "bearer", "access_token",
        // Ask模式数据收集
        //"ask_mode", "question_data", "user_query", "conversation_data",
        // Bug报告功能
        "bug_report",
        "error_report",
        "crash_report",
        "diagnostic_data",
        // MCP工具数据传输
        //"mcp_data", "stripe_data", "sentry_data", "redis_data",
        // Segment.io 数据分析拦截
        "segment.io",
        "api.segment.io",
        "/v1/batch",
        "segment",
        "writeKey",
        "analytics.track",
        "analytics.identify",
        // 增强的身份追踪
        "user_id",
        "session_id",
        "anonymous_id",
        "device_id",
        "fingerprint",
        "tenant_id",
        "client_id"
      ];
      INTERCEPT_PATTERNS = [...TELEMETRY_PATTERNS, ...enhancedBlockedPatterns];
    }
  });

  // src/utils/logger.js
  function logOnce(message, type = null) {
    const logKey = type || message;
    if (!loggedMessages.has(logKey)) {
      loggedMessages.add(logKey);
      console.log(`[AugmentCode拦截器] ${message}`);
    }
  }
  function log(message, level = "info") {
    if (!INTERCEPTOR_CONFIG.debugMode)
      return;
    const prefix = "[AugmentCode拦截器]";
    switch (level) {
      case "warn":
        console.warn(`${prefix} ⚠️ ${message}`);
        break;
      case "error":
        console.error(`${prefix} ❌ ${message}`);
        break;
      default:
        console.log(`${prefix} ${message}`);
    }
  }
  var loggedMessages;
  var init_logger = __esm({
    "src/utils/logger.js"() {
      init_config();
      loggedMessages = /* @__PURE__ */ new Set();
    }
  });

  // src/utils/system-info-generator.js
  var SystemInfoGenerator;
  var init_system_info_generator = __esm({
    "src/utils/system-info-generator.js"() {
      init_config();
      init_logger();
      SystemInfoGenerator = {
        /**
         * 生成完整的假系统信息（平台感知版）
         */
        generateFakeSystemInfo() {
          const realPlatform = process.platform;
          const realArch = process.arch;
          log(`🔍 检测到真实平台: ${realPlatform}/${realArch}`);
          const baseInfo = {
            // 平台感知的系统信息
            platform: this.generatePlatformSpecificInfo(realPlatform),
            arch: this.generateArchSpecificInfo(realPlatform, realArch),
            hostname: this.generateHostname(),
            type: this.generateOSTypeForPlatform(realPlatform),
            version: this.generateOSVersionForPlatform(realPlatform),
            // VSCode相关
            vscodeVersion: this.generateVSCodeVersion(),
            machineId: this.generateMachineId()
          };
          if (realPlatform === "darwin") {
            baseInfo.macUUID = this.generateMacUUID();
            baseInfo.macSerial = this.generateMacSerial();
            baseInfo.macBoardId = this.generateMacBoardId();
            baseInfo.macModel = this.generateMacModel();
            log(`🍎 生成macOS特定信息`);
          } else if (realPlatform === "win32") {
            baseInfo.winGuid = this.generateWindowsGuid();
            baseInfo.winProductId = this.generateWindowsProductId();
            baseInfo.winSerial = this.generateWindowsSerial();
            log(`🪟 生成Windows特定信息`);
          } else {
            baseInfo.linuxMachineId = this.generateLinuxMachineId();
            log(`🐧 生成Linux特定信息`);
          }
          return baseInfo;
        },
        /**
         * 生成Mac UUID
         */
        generateMacUUID() {
          return [8, 4, 4, 4, 12].map(
            (len) => Array.from(
              { length: len },
              () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
            ).join("")
          ).join("-");
        },
        /**
         * 生成Mac序列号（支持M系列处理器，使用真实前缀）
         */
        generateMacSerial() {
          const realArch = process.arch;
          const prefixes = realArch === "arm64" ? [
            // M系列处理器序列号前缀
            "C02",
            // 通用前缀
            "F4H",
            // M1 MacBook Air
            "F86",
            // M1 MacBook Pro
            "G8V",
            // M1 iMac
            "H7J",
            // M1 Pro MacBook Pro
            "J1G",
            // M1 Max MacBook Pro
            "K2H",
            // M2 MacBook Air
            "L3M",
            // M2 MacBook Pro
            "M9N",
            // M2 Pro MacBook Pro
            "N5P",
            // M2 Max MacBook Pro
            "P7Q",
            // M3 MacBook Air
            "Q8R",
            // M3 MacBook Pro
            "R9S"
            // M3 Pro/Max MacBook Pro
          ] : [
            // Intel处理器序列号前缀
            "C02",
            // 通用前缀
            "C17",
            // Intel MacBook Pro
            "C07",
            // Intel MacBook Air
            "F5K",
            // Intel iMac
            "G5K"
            // Intel Mac Pro
          ];
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          let suffix = "";
          for (let i = 0; i < 9; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
          }
          const serial = prefix + suffix;
          if (serial.length !== 12) {
            console.warn(`⚠️ Mac序列号长度异常: ${serial} (长度: ${serial.length})`);
            return "C02" + Array.from(
              { length: 9 },
              () => chars[Math.floor(Math.random() * chars.length)]
            ).join("");
          }
          return serial;
        },
        /**
         * 生成Windows GUID
         */
        generateWindowsGuid() {
          return "{" + [8, 4, 4, 4, 12].map(
            (len) => Array.from(
              { length: len },
              () => "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
            ).join("")
          ).join("-") + "}";
        },
        /**
         * 生成VSCode machineId格式（64位十六进制字符串）
         */
        generateMachineId() {
          return Array.from(
            { length: 64 },
            () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
          ).join("");
        },
        /**
         * 生成Windows产品ID
         * 格式: 00330-91125-35784-AA503 (20个字符，全数字+固定AA)
         * 基于真实Windows ProductId格式
         */
        generateWindowsProductId() {
          const firstGroup = Array.from(
            { length: 5 },
            () => "0123456789"[Math.floor(Math.random() * 10)]
          ).join("");
          const secondGroup = Array.from(
            { length: 5 },
            () => "0123456789"[Math.floor(Math.random() * 10)]
          ).join("");
          const thirdGroup = Array.from(
            { length: 5 },
            () => "0123456789"[Math.floor(Math.random() * 10)]
          ).join("");
          const fourthGroup = "AA" + Array.from(
            { length: 3 },
            () => "0123456789"[Math.floor(Math.random() * 10)]
          ).join("");
          return `${firstGroup}-${secondGroup}-${thirdGroup}-${fourthGroup}`;
        },
        /**
         * 生成平台特定信息（平台感知）
         * @param {string} realPlatform - 真实平台
         */
        generatePlatformSpecificInfo(realPlatform) {
          return realPlatform;
        },
        /**
         * 生成架构特定信息（平台感知）
         * @param {string} realPlatform - 真实平台
         * @param {string} realArch - 真实架构
         */
        generateArchSpecificInfo(realPlatform, realArch) {
          return realArch;
        },
        /**
         * 生成平台信息（已弃用，保留向后兼容）
         */
        generatePlatform() {
          const platforms = ["darwin", "win32", "linux"];
          return platforms[Math.floor(Math.random() * platforms.length)];
        },
        /**
         * 生成架构信息（已弃用，保留向后兼容）
         */
        generateArch() {
          const archs = ["x64", "arm64"];
          return archs[Math.floor(Math.random() * archs.length)];
        },
        /**
         * 生成主机名（v2.5增强版 - 多样化格式）
         */
        generateHostname() {
          const prefixes = [
            "desktop",
            "laptop",
            "workstation",
            "dev",
            "user",
            "admin",
            "test",
            "build",
            "server",
            "client",
            "node",
            "host",
            "machine",
            "system",
            "office",
            "home",
            "work",
            "studio",
            "lab",
            "prod",
            "staging"
          ];
          const suffixes = [
            "pc",
            "machine",
            "host",
            "system",
            "box",
            "rig",
            "station",
            "node",
            "device",
            "unit",
            "terminal",
            "computer",
            "workstation"
          ];
          const brands = [
            "dell",
            "hp",
            "lenovo",
            "asus",
            "acer",
            "msi",
            "apple",
            "surface",
            "thinkpad",
            "pavilion",
            "inspiron",
            "latitude",
            "precision"
          ];
          const adjectives = [
            "fast",
            "quick",
            "smart",
            "pro",
            "elite",
            "ultra",
            "max",
            "plus",
            "prime",
            "core",
            "edge",
            "zen",
            "nova",
            "apex",
            "flux",
            "sync"
          ];
          const formats = [
            // 传统格式：prefix-suffix-number (30%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
              const number = Math.floor(Math.random() * 999) + 1;
              return `${prefix}-${suffix}-${number}`;
            },
            // 品牌格式：brand-model-number (20%)
            () => {
              const brand = brands[Math.floor(Math.random() * brands.length)];
              const model = adjectives[Math.floor(Math.random() * adjectives.length)];
              const number = Math.floor(Math.random() * 9999) + 1e3;
              return `${brand}-${model}-${number}`;
            },
            // 下划线格式：prefix_suffix_number (15%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
              const number = Math.floor(Math.random() * 999) + 1;
              return `${prefix}_${suffix}_${number}`;
            },
            // 简单格式：prefix + number (15%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const number = Math.floor(Math.random() * 99) + 1;
              return `${prefix}${number}`;
            },
            // 混合格式：adjective-prefix-number (10%)
            () => {
              const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const number = Math.floor(Math.random() * 999) + 1;
              return `${adjective}-${prefix}-${number}`;
            },
            // 大写格式：PREFIX-NUMBER (5%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const number = Math.floor(Math.random() * 9999) + 1e3;
              return `${prefix.toUpperCase()}-${number}`;
            },
            // 域名风格：prefix.suffix.local (3%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
              return `${prefix}.${suffix}.local`;
            },
            // 无分隔符格式：prefixnumber (2%)
            () => {
              const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              const number = Math.floor(Math.random() * 999) + 1;
              return `${prefix}${number}`;
            }
          ];
          const weights = [30, 20, 15, 15, 10, 5, 3, 2];
          const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
          let random = Math.floor(Math.random() * totalWeight);
          let selectedIndex = 0;
          for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random < 0) {
              selectedIndex = i;
              break;
            }
          }
          return formats[selectedIndex]();
        },
        /**
         * 生成平台特定的OS类型
         * @param {string} realPlatform - 真实平台
         */
        generateOSTypeForPlatform(realPlatform) {
          switch (realPlatform) {
            case "darwin":
              return "Darwin";
            case "win32":
              return "Windows_NT";
            case "linux":
              return "Linux";
            default:
              return "Linux";
          }
        },
        /**
         * 生成平台特定的OS版本（支持M系列架构感知）
         * @param {string} realPlatform - 真实平台
         */
        generateOSVersionForPlatform(realPlatform) {
          switch (realPlatform) {
            case "darwin":
              const realArch = process.arch;
              if (realArch === "arm64") {
                const mSeriesVersions = [
                  // macOS Big Sur (M1支持开始)
                  "20.6.0",
                  // macOS 11.6 Big Sur
                  // macOS Monterey (M1 Pro/Max支持)
                  "21.1.0",
                  // macOS 12.1 Monterey
                  "21.2.0",
                  // macOS 12.2 Monterey
                  "21.3.0",
                  // macOS 12.3 Monterey
                  "21.4.0",
                  // macOS 12.4 Monterey
                  "21.5.0",
                  // macOS 12.5 Monterey
                  "21.6.0",
                  // macOS 12.6 Monterey
                  // macOS Ventura (M2支持)
                  "22.1.0",
                  // macOS 13.1 Ventura
                  "22.2.0",
                  // macOS 13.2 Ventura
                  "22.3.0",
                  // macOS 13.3 Ventura
                  "22.4.0",
                  // macOS 13.4 Ventura
                  "22.5.0",
                  // macOS 13.5 Ventura
                  "22.6.0",
                  // macOS 13.6 Ventura
                  // macOS Sonoma (M3支持)
                  "23.0.0",
                  // macOS 14.0 Sonoma
                  "23.1.0",
                  // macOS 14.1 Sonoma
                  "23.2.0",
                  // macOS 14.2 Sonoma
                  "23.3.0",
                  // macOS 14.3 Sonoma
                  "23.4.0",
                  // macOS 14.4 Sonoma
                  "23.5.0",
                  // macOS 14.5 Sonoma
                  "23.6.0",
                  // macOS 14.6 Sonoma
                  // macOS Sequoia (M4支持)
                  "24.0.0",
                  // macOS 15.0 Sequoia
                  "24.1.0",
                  // macOS 15.1 Sequoia
                  "24.2.0"
                  // macOS 15.2 Sequoia
                ];
                return mSeriesVersions[Math.floor(Math.random() * mSeriesVersions.length)];
              } else {
                const intelVersions = [
                  // macOS Catalina (Intel支持)
                  "19.6.0",
                  // macOS 10.15.7 Catalina
                  // macOS Big Sur (Intel支持)
                  "20.1.0",
                  // macOS 11.1 Big Sur
                  "20.2.0",
                  // macOS 11.2 Big Sur
                  "20.3.0",
                  // macOS 11.3 Big Sur
                  "20.4.0",
                  // macOS 11.4 Big Sur
                  "20.5.0",
                  // macOS 11.5 Big Sur
                  "20.6.0",
                  // macOS 11.6 Big Sur
                  // macOS Monterey (Intel支持)
                  "21.1.0",
                  // macOS 12.1 Monterey
                  "21.2.0",
                  // macOS 12.2 Monterey
                  "21.3.0",
                  // macOS 12.3 Monterey
                  "21.4.0",
                  // macOS 12.4 Monterey
                  "21.5.0",
                  // macOS 12.5 Monterey
                  "21.6.0",
                  // macOS 12.6 Monterey
                  // macOS Ventura (Intel支持)
                  "22.1.0",
                  // macOS 13.1 Ventura
                  "22.2.0",
                  // macOS 13.2 Ventura
                  "22.3.0",
                  // macOS 13.3 Ventura
                  "22.4.0",
                  // macOS 13.4 Ventura
                  "22.5.0",
                  // macOS 13.5 Ventura
                  "22.6.0",
                  // macOS 13.6 Ventura
                  // macOS Sonoma (Intel支持)
                  "23.0.0",
                  // macOS 14.0 Sonoma
                  "23.1.0",
                  // macOS 14.1 Sonoma
                  "23.2.0",
                  // macOS 14.2 Sonoma
                  "23.3.0",
                  // macOS 14.3 Sonoma
                  "23.4.0",
                  // macOS 14.4 Sonoma
                  "23.5.0",
                  // macOS 14.5 Sonoma
                  "23.6.0"
                  // macOS 14.6 Sonoma (Intel最后支持版本)
                ];
                return intelVersions[Math.floor(Math.random() * intelVersions.length)];
              }
            case "win32":
              const winVersions = [
                "10.0.19041",
                // Windows 10 20H1
                "10.0.19042",
                // Windows 10 20H2
                "10.0.19043",
                // Windows 10 21H1
                "10.0.19044",
                // Windows 10 21H2
                "10.0.22000",
                // Windows 11 21H2
                "10.0.22621",
                // Windows 11 22H2
                "10.0.22631"
                // Windows 11 23H2
              ];
              return winVersions[Math.floor(Math.random() * winVersions.length)];
            case "linux":
            default:
              const linuxVersions = [
                "5.15.0",
                "5.19.0",
                "6.1.0",
                "6.2.0",
                "6.5.0",
                "6.8.0"
              ];
              return linuxVersions[Math.floor(Math.random() * linuxVersions.length)];
          }
        },
        /**
         * 生成操作系统类型（已弃用，保留向后兼容）
         */
        generateOSType() {
          const types = ["Darwin", "Windows_NT", "Linux"];
          return types[Math.floor(Math.random() * types.length)];
        },
        /**
         * 生成操作系统版本（已弃用，保留向后兼容）
         */
        generateOSVersion() {
          const versions = [
            "22.6.0",
            "23.1.0",
            "23.2.0",
            "23.3.0",
            "23.4.0",
            "10.0.22621",
            "10.0.22631",
            "6.2.0",
            "6.5.0"
          ];
          return versions[Math.floor(Math.random() * versions.length)];
        },
        /**
         * 生成VSCode版本
         */
        generateVSCodeVersion() {
          return INTERCEPTOR_CONFIG.vscode.versions[Math.floor(Math.random() * INTERCEPTOR_CONFIG.vscode.versions.length)];
        },
        /**
         * 生成假的macOS主板ID（随机16位十六进制）
         */
        generateMacBoardId() {
          const randomHex = Array.from(
            { length: 16 },
            () => "0123456789ABCDEF"[Math.floor(16 * Math.random())]
          ).join("");
          return `Mac-${randomHex}`;
        },
        /**
         * 生成假的Mac型号（基于真实架构）
         */
        generateMacModel() {
          const realArch = process.arch;
          const models = realArch === "arm64" ? [
            // M系列Mac型号
            "MacBookAir10,1",
            // M1 MacBook Air
            "MacBookPro17,1",
            // M1 MacBook Pro 13"
            "MacBookPro18,1",
            // M1 Pro MacBook Pro 14"
            "MacBookPro18,2",
            // M1 Pro MacBook Pro 16"
            "MacBookPro18,3",
            // M1 Max MacBook Pro 14"
            "MacBookPro18,4",
            // M1 Max MacBook Pro 16"
            "MacBookAir15,2",
            // M2 MacBook Air
            "MacBookPro19,1",
            // M2 MacBook Pro 13"
            "MacBookPro19,3",
            // M2 Pro MacBook Pro 14"
            "MacBookPro19,4",
            // M2 Pro MacBook Pro 16"
            "MacBookPro20,1",
            // M2 Max MacBook Pro 14"
            "MacBookPro20,2",
            // M2 Max MacBook Pro 16"
            "iMac21,1",
            // M1 iMac 24"
            "iMac21,2",
            // M1 iMac 24"
            "Macmini9,1",
            // M1 Mac mini
            "MacStudio10,1",
            // M1 Max Mac Studio
            "MacStudio10,2"
            // M1 Ultra Mac Studio
          ] : [
            // Intel Mac型号
            "MacBookPro15,1",
            // Intel MacBook Pro 15" 2018-2019
            "MacBookPro15,2",
            // Intel MacBook Pro 13" 2018-2019
            "MacBookPro15,3",
            // Intel MacBook Pro 15" 2019
            "MacBookPro15,4",
            // Intel MacBook Pro 13" 2019
            "MacBookPro16,1",
            // Intel MacBook Pro 16" 2019-2020
            "MacBookPro16,2",
            // Intel MacBook Pro 13" 2020
            "MacBookPro16,3",
            // Intel MacBook Pro 13" 2020
            "MacBookPro16,4",
            // Intel MacBook Pro 16" 2020
            "MacBookAir8,1",
            // Intel MacBook Air 2018
            "MacBookAir8,2",
            // Intel MacBook Air 2019
            "MacBookAir9,1",
            // Intel MacBook Air 2020
            "iMac19,1",
            // Intel iMac 27" 2019
            "iMac19,2",
            // Intel iMac 21.5" 2019
            "iMac20,1",
            // Intel iMac 27" 2020
            "iMac20,2",
            // Intel iMac 27" 2020
            "Macmini8,1",
            // Intel Mac mini 2018
            "iMacPro1,1"
            // Intel iMac Pro 2017
          ];
          const selectedModel = models[Math.floor(Math.random() * models.length)];
          log(`🎯 生成Mac型号: ${selectedModel} (架构: ${realArch})`);
          return selectedModel;
        },
        /**
         * 生成假的Windows序列号
         * 格式: 8位字符 (如: PF5X3L1C)，支持8位和10位两种格式
         */
        generateWindowsSerial() {
          const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          const length = Math.random() < 0.7 ? 8 : 10;
          return Array.from({ length }, () => chars[Math.floor(36 * Math.random())]).join("");
        },
        /**
         * 生成假的IOPlatform UUID（用于ioreg输出伪造）
         */
        generateFakeIOPlatformUUID() {
          return [8, 4, 4, 4, 12].map(
            (length) => Array.from({ length }, () => "0123456789ABCDEF"[Math.floor(16 * Math.random())]).join("")
          ).join("-");
        },
        /**
         * 生成假的IOPlatform序列号（用于ioreg输出伪造）
         * 修复：生成正确的12字符长度序列号
         */
        generateFakeIOPlatformSerial() {
          const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          return "C02" + Array.from({ length: 9 }, () => chars[Math.floor(36 * Math.random())]).join("");
        },
        /**
         * 生成Linux机器ID
         */
        generateLinuxMachineId() {
          return Array.from(
            { length: 32 },
            () => "0123456789abcdef"[Math.floor(16 * Math.random())]
          ).join("");
        }
      };
    }
  });

  // src/utils/url-classifier.js
  function shouldInterceptUrl(url, data = "") {
    if (typeof url !== "string")
      return false;
    const cached = URLClassificationCache.get(url, data);
    if (cached !== null) {
      return cached.shouldIntercept;
    }
    const urlLower = url.toLowerCase();
    let shouldIntercept = false;
    let reason = "";
    if (INTERCEPTOR_CONFIG.dataProtection.enableEnhancedWhitelist) {
      const isCodeIndexing = CODE_INDEXING_PATTERNS.some(
        (pattern) => urlLower.includes(pattern.toLowerCase())
      );
      if (isCodeIndexing) {
        shouldIntercept = false;
        reason = "代码索引白名单保护";
        log(`✅ 代码索引白名单保护: ${url}`);
      }
    }
    if (!shouldIntercept) {
      const matchesInterceptPattern = INTERCEPT_PATTERNS.some(
        (pattern) => urlLower.includes(pattern.toLowerCase())
      );
      if (matchesInterceptPattern) {
        const importantPatterns = [
          "vscode-webview://",
          "vscode-file://",
          "vscode-resource://",
          "localhost:",
          "127.0.0.1:",
          "file://",
          "data:",
          "blob:",
          "chrome-extension://",
          "moz-extension://",
          "ms-browser-extension://"
        ];
        const isImportant = importantPatterns.some(
          (pattern) => urlLower.includes(pattern)
        );
        if (isImportant) {
          shouldIntercept = false;
          reason = "重要功能URL保护";
          if (INTERCEPTOR_CONFIG.network.logInterceptions) {
            log(`✅ 允许重要功能URL: ${url}`);
          }
        } else {
          shouldIntercept = true;
          reason = "匹配拦截模式";
        }
      } else {
        shouldIntercept = false;
        reason = "未匹配拦截模式";
      }
    }
    const result = { shouldIntercept, reason };
    URLClassificationCache.set(url, data, result);
    return shouldIntercept;
  }
  var URLClassificationCache;
  var init_url_classifier = __esm({
    "src/utils/url-classifier.js"() {
      init_config();
      init_logger();
      URLClassificationCache = {
        // 缓存存储
        cache: /* @__PURE__ */ new Map(),
        // 缓存统计
        stats: {
          hits: 0,
          misses: 0,
          totalRequests: 0
        },
        // 缓存大小限制
        maxCacheSize: 1e3,
        /**
         * 获取缓存的分类结果
         * @param {string} url - URL
         * @param {string} data - 请求数据
         * @returns {Object|null} 缓存的分类结果或null
         */
        get(url, data = "") {
          this.stats.totalRequests++;
          const cacheKey = this.generateCacheKey(url, data);
          if (this.cache.has(cacheKey)) {
            this.stats.hits++;
            const cached = this.cache.get(cacheKey);
            log(`💾 缓存命中: ${url} -> ${cached.shouldIntercept ? "拦截" : "放行"}`);
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
        set(url, data = "", result) {
          const cacheKey = this.generateCacheKey(url, data);
          if (this.cache.size >= this.maxCacheSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
            log(`🗑️ 缓存已满，删除最旧条目: ${firstKey}`);
          }
          this.cache.set(cacheKey, {
            ...result,
            timestamp: Date.now(),
            url
          });
          log(`💾 缓存设置: ${url} -> ${result.shouldIntercept ? "拦截" : "放行"}`);
        },
        /**
         * 生成缓存键
         * @param {string} url - URL
         * @param {string} data - 请求数据
         * @returns {string} 缓存键
         */
        generateCacheKey(url, data = "") {
          let dataHash = "";
          if (data && typeof data === "string" && data.length > 0) {
            let hash = 0;
            for (let i = 0; i < Math.min(data.length, 100); i++) {
              const char = data.charCodeAt(i);
              hash = (hash << 5) - hash + char;
              hash = hash & hash;
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
          log("🗑️ URL分类缓存已清空");
        },
        /**
         * 获取缓存统计
         * @returns {Object} 缓存统计信息
         */
        getStats() {
          const hitRate = this.stats.totalRequests > 0 ? (this.stats.hits / this.stats.totalRequests * 100).toFixed(2) : 0;
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
          console.log("\n📊 URL分类缓存统计");
          console.log("=".repeat(30));
          console.log(`缓存大小: ${stats.cacheSize}/${stats.maxCacheSize}`);
          console.log(`缓存命中: ${stats.hits}`);
          console.log(`缓存未命中: ${stats.misses}`);
          console.log(`总请求数: ${stats.totalRequests}`);
          console.log(`命中率: ${stats.hitRate}`);
          console.log("=".repeat(30));
        }
      };
    }
  });

  // src/core/session-manager.js
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
  function isSessionId(value) {
    if (typeof value !== "string")
      return false;
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidPattern.test(value))
      return true;
    if (value.length >= 16 && /^[a-zA-Z0-9_-]+$/.test(value))
      return true;
    return false;
  }
  var SessionManager;
  var init_session_manager = __esm({
    "src/core/session-manager.js"() {
      init_logger();
      SessionManager = {
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
          log("🔄 已重新生成所有会话ID");
        },
        /**
         * 替换请求头中的会话ID
         * @param {Object} headers - 请求头对象
         * @returns {boolean} 是否进行了替换
         */
        replaceSessionIds(headers) {
          if (!headers || typeof headers !== "object")
            return false;
          let replaced = false;
          const idFieldMappings = {
            // 请求ID - 每次请求都应该是唯一的
            //"x-request-id": () => this.generateUniqueRequestId(),
            // 会话ID - 使用主会话ID
            "x-request-session-id": () => this.getMainSessionId()
            // "session-id": () => this.getMainSessionId(),
            // "sessionId": () => this.getMainSessionId(),
            // "x-session-id": () => this.getMainSessionId(),
            // // 用户ID - 使用用户ID
            // "x-user-id": () => this.getUserId(),
            // "user-id": () => this.getUserId(),
            // "userId": () => this.getUserId(),
            // "x-user": () => this.getUserId()
          };
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
          } else {
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
          return [8, 4, 4, 4, 12].map(
            (len) => Array.from(
              { length: len },
              () => "0123456789abcdef"[Math.floor(Math.random() * 16)]
            ).join("")
          ).join("-");
        }
      };
      log(`🆔 会话管理器初始化完成，主会话ID: ${SessionManager.getMainSessionId()}`);
    }
  });

  // src/core/classifier.js
  var SmartDataClassifier;
  var init_classifier = __esm({
    "src/core/classifier.js"() {
      init_config();
      init_logger();
      SmartDataClassifier = {
        /**
         * 检查是否为必要端点（最高优先级保护）
         * @param {string} context - 上下文信息（通常是URL）
         * @returns {boolean} 是否为必要端点
         */
        isEssentialEndpoint(context = "") {
          if (!context)
            return false;
          const contextStr = context.toLowerCase();
          const isEssential = ESSENTIAL_ENDPOINTS.some((endpoint) => {
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
        isPreciseTelemetryEndpoint(context = "") {
          if (!context)
            return false;
          const contextStr = context.toLowerCase();
          const isExactMatch = PRECISE_TELEMETRY_ENDPOINTS.some((endpoint) => {
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
        isCodeIndexingRelated(data, context = "") {
          if (!data)
            return false;
          const dataStr = typeof data === "string" ? data : JSON.stringify(data);
          const contextStr = context.toLowerCase();
          const matchedPattern = CODE_INDEXING_PATTERNS.find(
            (pattern) => dataStr.toLowerCase().includes(pattern.toLowerCase()) || contextStr.includes(pattern.toLowerCase())
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
        isTelemetryData(data, context = "") {
          if (!data)
            return false;
          const dataStr = typeof data === "string" ? data : JSON.stringify(data);
          const contextStr = context.toLowerCase();
          const matchedPattern = TELEMETRY_PATTERNS.find(
            (pattern) => dataStr.toLowerCase().includes(pattern.toLowerCase()) || contextStr.includes(pattern.toLowerCase())
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
        shouldInterceptUpload(data, context = "") {
          if (this.isEssentialEndpoint(context)) {
            log(`🛡️ [第零层] 必要端点保护，绝对不拦截: ${context}`);
            return false;
          }
          if (this.isPreciseTelemetryEndpoint(context)) {
            log(`🚫 [第一层] 精确遥测端点拦截: ${context}`);
            return true;
          }
          if (this.isTelemetryData(data, context)) {
            log(`🚫 [第二层] 遥测关键字拦截: ${context}`);
            return true;
          }
          if (this.isCodeIndexingRelated(data, context)) {
            log(`✅ [第三层] 代码索引功能保护: ${context}`);
            return false;
          }
          log(`⚪ [第四层] 未知数据，采用保守策略: ${context}`);
          return false;
        }
      };
    }
  });

  // src/core/identity-manager.js
  var init_identity_manager = __esm({
    "src/core/identity-manager.js"() {
      init_logger();
    }
  });

  // src/interceptors/network.js
  var NetworkInterceptor;
  var init_network = __esm({
    "src/interceptors/network.js"() {
      init_config();
      init_logger();
      init_url_classifier();
      init_classifier();
      init_session_manager();
      NetworkInterceptor = {
        /**
         * 记录所有请求的详细信息（包括拦截和放行的）
         */
        logRequestDetails(url, method = "GET", body = null, options = {}, action = "UNKNOWN", reason = "", response = null) {
          if (!INTERCEPTOR_CONFIG.network.logAllRequests)
            return;
          const timestamp = (/* @__PURE__ */ new Date()).toISOString();
          const limit = INTERCEPTOR_CONFIG.network.requestLogLimit;
          let actionIcon = "";
          let actionColor = "";
          switch (action) {
            case "INTERCEPTED":
              actionIcon = "🚫";
              actionColor = "拦截";
              break;
            case "ALLOWED":
              actionIcon = "✅";
              actionColor = "放行";
              break;
            case "PROTECTED":
              actionIcon = "🛡️";
              actionColor = "保护";
              break;
            default:
              actionIcon = "❓";
              actionColor = "未知";
          }
          let requestPackage = `
=== ${actionIcon} 网络请求${actionColor} ===
`;
          requestPackage += `时间: ${timestamp}
`;
          requestPackage += `原因: ${reason}
`;
          requestPackage += `方法: ${method}
`;
          requestPackage += `URL: ${url}
`;
          if (options.headers) {
            requestPackage += `
--- 请求头 ---
`;
            if (typeof options.headers === "object") {
              if (options.headers instanceof Headers) {
                for (const [key, value] of options.headers.entries()) {
                  requestPackage += `${key}: ${value}
`;
                }
              } else {
                for (const [key, value] of Object.entries(options.headers)) {
                  requestPackage += `${key}: ${value}
`;
                }
              }
            } else {
              requestPackage += `Headers: [Headers对象存在但无法解析]
`;
            }
          }
          if (body) {
            requestPackage += `
--- 请求体 ---
`;
            let bodyString = "";
            if (typeof body === "string") {
              bodyString = body;
            } else if (body instanceof FormData) {
              bodyString = "[FormData - 无法显示内容]";
              try {
                const keys = Array.from(body.keys());
                if (keys.length > 0) {
                  bodyString += `
FormData键: ${keys.join(", ")}`;
                }
              } catch (e) {
                bodyString += "\n[无法获取FormData键]";
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
            requestPackage += `
--- 请求体 ---
[无请求体]`;
          }
          if (response) {
            requestPackage += `
--- 响应信息 ---
`;
            try {
              if (typeof response === "object") {
                if (response.status !== void 0) {
                  requestPackage += `状态码: ${response.status}
`;
                }
                if (response.statusText !== void 0) {
                  requestPackage += `状态文本: ${response.statusText}
`;
                }
                if (response.ok !== void 0) {
                  requestPackage += `请求成功: ${response.ok}
`;
                }
                if (response.headers) {
                  requestPackage += `
--- 响应头 ---
`;
                  if (response.headers instanceof Headers) {
                    for (const [key, value] of response.headers.entries()) {
                      requestPackage += `${key}: ${value}
`;
                    }
                  } else if (typeof response.headers === "object") {
                    for (const [key, value] of Object.entries(response.headers)) {
                      requestPackage += `${key}: ${value}
`;
                    }
                  }
                }
                if (response._responseText || response.responseText) {
                  const responseText = response._responseText || response.responseText;
                  requestPackage += `
--- 响应体 ---
${responseText}
`;
                } else if (response._jsonData) {
                  requestPackage += `
--- 响应体 (JSON) ---
${JSON.stringify(response._jsonData, null, 2)}
`;
                }
              } else if (typeof response === "string") {
                requestPackage += `响应内容: ${response}
`;
              } else {
                requestPackage += `响应类型: ${typeof response}
`;
                requestPackage += `响应内容: ${String(response).substring(0, 200)}${String(response).length > 200 ? "..." : ""}
`;
              }
            } catch (e) {
              requestPackage += `[响应解析失败: ${e.message}]
`;
            }
          } else {
            requestPackage += `
--- 响应信息 ---
[无响应数据或响应未记录]`;
          }
          requestPackage += `
=== 请求${actionColor}结束 ===
`;
          const truncatedPackage = requestPackage.length > limit ? requestPackage.substring(0, limit) + "\n...[请求包过长，已截断]" : requestPackage;
          console.log(truncatedPackage);
        },
        /**
         * 记录被放行的请求（调试功能）
         */
        logAllowedRequest(url, method = "GET", body = null, options = {}) {
          if (!INTERCEPTOR_CONFIG.network.logAllowedRequests)
            return;
          this.logRequestDetails(url, method, body, options, "ALLOWED", "通过白名单检查");
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
            log("✅ 已启用Fetch拦截");
          }
          if (INTERCEPTOR_CONFIG.network.enableXhrInterception) {
            this.interceptXHRDecrypted();
            log("✅ 已启用XMLHttpRequest拦截");
          }
          if (INTERCEPTOR_CONFIG.network.enableHttpInterception || INTERCEPTOR_CONFIG.network.enableFetchInterception || INTERCEPTOR_CONFIG.network.enableXhrInterception) {
            this.interceptAxios();
            log("✅ 已启用Axios拦截");
          }
          log("🌐 网络拦截模块初始化完成");
        },
        /**
         * 创建模拟Fetch响应
         */
        createMockFetchResponse() {
          const mockData = { success: true, intercepted: true, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
          const mockText = JSON.stringify(mockData);
          return {
            ok: true,
            status: 200,
            statusText: "OK",
            headers: /* @__PURE__ */ new Map([
              ["content-type", "application/json"],
              ["x-intercepted", "true"],
              ["x-interceptor-version", "v2.5"]
            ]),
            json: () => Promise.resolve(mockData),
            text: () => Promise.resolve(mockText),
            blob: () => Promise.resolve(new Blob([mockText], { type: "application/json" })),
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(2)),
            clone: function() {
              return this;
            },
            _jsonData: mockData,
            _responseText: mockText
          };
        },
        /**
         * v2.5改进：更智能的Fetch拦截（解密版）
         */
        interceptFetchDecrypted() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          if (globalObj.fetch) {
            const originalFetch = globalObj.fetch;
            globalObj.fetch = function(url, options = {}) {
              const urlString = url.toString();
              const method = options.method || "GET";
              if (SmartDataClassifier.shouldInterceptUpload(options.body || "", urlString)) {
                const mockResponse = NetworkInterceptor.createMockFetchResponse();
                NetworkInterceptor.logRequestDetails(
                  urlString,
                  method,
                  options.body,
                  options,
                  "INTERCEPTED",
                  "智能拦截 - 识别为遥测数据",
                  mockResponse
                );
                log(`🚫 智能拦截Fetch请求: ${urlString}`);
                return Promise.resolve(mockResponse);
              }
              if (urlString.includes("segment.io") || urlString.includes("api.segment.io") || urlString.includes("/v1/batch") || urlString.includes("/v1/track")) {
                const segmentResponse = NetworkInterceptor.createMockFetchResponse();
                NetworkInterceptor.logRequestDetails(
                  urlString,
                  method,
                  options.body,
                  options,
                  "INTERCEPTED",
                  "Segment.io数据收集拦截",
                  segmentResponse
                );
                log(`🚫 阻止 Segment.io Fetch请求: ${urlString}`);
                return Promise.resolve(segmentResponse);
              }
              if (shouldInterceptUrl(urlString, options.body || "")) {
                const mockResponse = NetworkInterceptor.createMockFetchResponse();
                NetworkInterceptor.logRequestDetails(
                  urlString,
                  method,
                  options.body,
                  options,
                  "INTERCEPTED",
                  "URL模式匹配拦截",
                  mockResponse
                );
                log(`🚫 拦截Fetch请求: ${urlString}`);
                return Promise.resolve(mockResponse);
              }
              if (options.headers) {
                SessionManager.replaceSessionIds(options.headers);
              }
              let allowReason = "通过所有拦截检查";
              if (SmartDataClassifier.isEssentialEndpoint(urlString)) {
                allowReason = "必要端点保护";
              } else if (SmartDataClassifier.isCodeIndexingRelated("", urlString)) {
                allowReason = "代码索引功能";
              }
              NetworkInterceptor.logRequestDetails(
                urlString,
                method,
                options.body,
                options,
                "ALLOWED",
                allowReason
              );
              return originalFetch.apply(this, arguments);
            };
            log("✅ Fetch拦截设置完成（解密版）");
          }
        },
        /**
         * XMLHttpRequest拦截（解密版）
         */
        interceptXHRDecrypted() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          if (globalObj.XMLHttpRequest) {
            const OriginalXHR = globalObj.XMLHttpRequest;
            globalObj.XMLHttpRequest = function() {
              const xhr = new OriginalXHR();
              const originalOpen = xhr.open;
              const originalSend = xhr.send;
              xhr.open = function(method, url, async, user, password) {
                this._method = method;
                this._url = url;
                if (SmartDataClassifier.shouldInterceptUpload("", url)) {
                  NetworkInterceptor.logRequestDetails(
                    url,
                    method,
                    null,
                    {},
                    "INTERCEPTED",
                    "智能拦截 - XMLHttpRequest识别为遥测数据"
                  );
                  log(`🚫 智能拦截XMLHttpRequest: ${url}`);
                  NetworkInterceptor.createMockXHRResponse(this);
                  return;
                }
                if (url.includes("segment.io") || url.includes("api.segment.io") || url.includes("/v1/batch") || url.includes("/v1/track")) {
                  NetworkInterceptor.logRequestDetails(
                    url,
                    method,
                    null,
                    {},
                    "INTERCEPTED",
                    "Segment.io数据收集拦截 - XMLHttpRequest"
                  );
                  log(`🚫 阻止 Segment.io XMLHttpRequest: ${url}`);
                  NetworkInterceptor.createMockXHRResponse(this);
                  return;
                }
                if (shouldInterceptUrl(url)) {
                  NetworkInterceptor.logRequestDetails(
                    url,
                    method,
                    null,
                    {},
                    "INTERCEPTED",
                    "URL模式匹配拦截 - XMLHttpRequest"
                  );
                  log(`🚫 拦截XMLHttpRequest: ${url}`);
                  NetworkInterceptor.createMockXHRResponse(this);
                  return;
                }
                let allowReason = "通过所有拦截检查 - XMLHttpRequest";
                if (SmartDataClassifier.isEssentialEndpoint(url)) {
                  allowReason = "必要端点保护 - XMLHttpRequest";
                } else if (SmartDataClassifier.isCodeIndexingRelated("", url)) {
                  allowReason = "代码索引功能 - XMLHttpRequest";
                }
                NetworkInterceptor.logRequestDetails(
                  url,
                  method,
                  null,
                  {},
                  "ALLOWED",
                  allowReason
                );
                return originalOpen.apply(this, arguments);
              };
              return xhr;
            };
            log("✅ XMLHttpRequest拦截设置完成（解密版）");
          }
        },
        /**
         * 创建模拟XMLHttpRequest响应
         */
        createMockXHRResponse(xhr) {
          Object.defineProperty(xhr, "readyState", { value: 4, writable: false });
          Object.defineProperty(xhr, "status", { value: 200, writable: false });
          Object.defineProperty(xhr, "statusText", { value: "OK", writable: false });
          Object.defineProperty(xhr, "responseText", { value: "{}", writable: false });
          Object.defineProperty(xhr, "response", { value: "{}", writable: false });
          setTimeout(() => {
            if (typeof xhr.onreadystatechange === "function") {
              xhr.onreadystatechange();
            }
            if (typeof xhr.onload === "function") {
              xhr.onload();
            }
          }, 0);
        },
        /**
         * Axios拦截
         */
        interceptAxios() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          if (globalObj.require) {
            const originalRequire = globalObj.require;
            globalObj.require = function(moduleName) {
              const module = originalRequire.apply(this, arguments);
              if (moduleName === "axios" && module && module.interceptors && module.interceptors.request) {
                module.interceptors.request.use(
                  function(config) {
                    const url = config.url || "";
                    const method = config.method || "GET";
                    if (SmartDataClassifier.shouldInterceptUpload(config.data || "", url)) {
                      NetworkInterceptor.logRequestDetails(
                        url,
                        method,
                        config.data,
                        config,
                        "INTERCEPTED",
                        "智能拦截 - Axios识别为遥测数据"
                      );
                      log(`🚫 智能拦截Axios请求: ${method} ${url}`);
                      config.adapter = function() {
                        return Promise.resolve({
                          data: {},
                          status: 200,
                          statusText: "OK",
                          headers: { "content-type": "application/json" },
                          config
                        });
                      };
                      return config;
                    }
                    if (shouldInterceptUrl(url)) {
                      NetworkInterceptor.logRequestDetails(
                        url,
                        method,
                        config.data,
                        config,
                        "INTERCEPTED",
                        "URL模式匹配拦截 - Axios"
                      );
                      log(`🚫 拦截Axios请求: ${url}`);
                      config.adapter = function() {
                        return Promise.resolve({
                          data: {},
                          status: 200,
                          statusText: "OK",
                          headers: { "content-type": "application/json" },
                          config
                        });
                      };
                      return config;
                    }
                    if (config.headers) {
                      SessionManager.replaceSessionIds(config.headers);
                    }
                    let allowReason = "通过所有拦截检查 - Axios";
                    if (SmartDataClassifier.isEssentialEndpoint(url)) {
                      allowReason = "必要端点保护 - Axios";
                    } else if (SmartDataClassifier.isCodeIndexingRelated(config.data || "", url)) {
                      allowReason = "代码索引功能 - Axios";
                    }
                    NetworkInterceptor.logRequestDetails(
                      url,
                      method,
                      config.data,
                      config,
                      "ALLOWED",
                      allowReason
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
            const http = __require("http");
            const https = __require("https");
            const originalHttpRequest = http.request;
            http.request = function(options, callback) {
              const url = NetworkInterceptor.buildUrlFromOptions(options);
              if (shouldInterceptUrl(url)) {
                log(`🚫 拦截HTTP请求: ${url}`);
                return NetworkInterceptor.createMockResponse(callback);
              }
              return originalHttpRequest.apply(this, arguments);
            };
            const originalHttpsRequest = https.request;
            https.request = function(options, callback) {
              const url = NetworkInterceptor.buildUrlFromOptions(options);
              if (shouldInterceptUrl(url)) {
                log(`🚫 拦截HTTPS请求: ${url}`);
                return NetworkInterceptor.createMockResponse(callback);
              }
              return originalHttpsRequest.apply(this, arguments);
            };
            log("✅ HTTP/HTTPS拦截设置完成");
          } catch (e) {
            log(`HTTP/HTTPS拦截设置失败: ${e.message}`, "error");
          }
        },
        /**
         * 从选项构建URL
         */
        buildUrlFromOptions(options) {
          if (typeof options === "string") {
            return options;
          }
          const protocol = options.protocol || "http:";
          const hostname = options.hostname || options.host || "localhost";
          const port = options.port ? `:${options.port}` : "";
          const path = options.path || "/";
          return `${protocol}//${hostname}${port}${path}`;
        },
        /**
         * 创建模拟HTTP响应
         */
        createMockResponse(callback) {
          const mockResponse = {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            on: function(event, handler) {
              if (event === "data") {
                setTimeout(() => handler("{}"), 0);
              } else if (event === "end") {
                setTimeout(handler, 0);
              }
            }
          };
          if (callback) {
            setTimeout(() => callback(mockResponse), 0);
          }
          return {
            on: () => {
            },
            write: () => {
            },
            end: () => {
            }
          };
        }
      };
    }
  });

  // src/interceptors/vscode.js
  var VSCodeInterceptor;
  var init_vscode = __esm({
    "src/interceptors/vscode.js"() {
      init_config();
      init_logger();
      init_session_manager();
      VSCodeInterceptor = {
        /**
         * 初始化VSCode拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enableVSCodeInterception) {
            return;
          }
          log("🎭 初始化VSCode拦截...");
          this.setupVersionConfig();
          this.interceptVSCodeModule();
          log("✅ VSCode拦截设置完成");
        },
        /**
         * 设置VSCode版本配置
         */
        setupVersionConfig() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
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
                log(`❌ 无效的VSCode版本: ${version}`, "error");
                return false;
              }
            },
            clearFixedVersion() {
              this.fixedVersion = null;
              log("🎲 已恢复随机VSCode版本模式");
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
          const sessionVersion = globalObj._augmentVSCodeVersionConfig.getRandomVersion();
          globalObj._augmentVSCodeVersionConfig.setFixedVersion(sessionVersion);
          log(`🔒 已为当前会话设置固定VSCode版本: ${sessionVersion}`);
        },
        /**
         * 拦截VSCode模块
         */
        interceptVSCodeModule() {
          if (typeof __require !== "undefined") {
            const originalRequire = __require;
            __require = function(moduleName) {
              if (moduleName === "vscode") {
                try {
                  const vscodeModule = originalRequire.apply(this, arguments);
                  if (vscodeModule && typeof vscodeModule === "object") {
                    logOnce("🎭 创建VSCode版本拦截代理...", "vscode-module-intercept");
                    return VSCodeInterceptor.createVSCodeProxy(vscodeModule);
                  }
                  return vscodeModule;
                } catch (e) {
                  log("提供VSCode模拟对象（带版本伪造）");
                  return VSCodeInterceptor.createMockVSCode();
                }
              }
              return originalRequire.apply(this, arguments);
            };
            Object.setPrototypeOf(__require, originalRequire);
            Object.getOwnPropertyNames(originalRequire).forEach((prop) => {
              if (prop !== "length" && prop !== "name") {
                __require[prop] = originalRequire[prop];
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
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          const randomVSCodeVersion = globalObj._augmentVSCodeVersionConfig ? globalObj._augmentVSCodeVersionConfig.getCurrentVersion() : "1.96.0";
          return new Proxy(vscodeModule, {
            get: function(target, prop, receiver) {
              if (prop === "version") {
                const originalVersion = target[prop];
                log(`🎭 拦截VSCode版本访问: ${originalVersion} → ${randomVSCodeVersion}`);
                return randomVSCodeVersion;
              }
              if (prop === "env") {
                const originalEnv = target[prop];
                if (originalEnv && typeof originalEnv === "object") {
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
              if (envProp === "uriScheme") {
                INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme++;
                const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                const fakeValue = "vscode";
                if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme === 1) {
                  logOnce("🎭 拦截VSCode URI方案访问", "vscode-uri-scheme-intercept");
                  logOnce(`📋 原始值: ${originalValue} → 伪造值: ${fakeValue}`, "vscode-uri-scheme-values");
                } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme % 10 === 0) {
                  log(`🎭 拦截VSCode URI方案访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.uriScheme}次)`);
                }
                return fakeValue;
              }
              if (envProp === "sessionId") {
                INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId++;
                const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                const fakeValue = SessionManager.getMainSessionId();
                if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId === 1) {
                  logOnce("🎭 拦截VSCode会话ID访问", "vscode-session-id-intercept");
                  logOnce(`📋 原始sessionId: ${originalValue}`, "vscode-session-id-original");
                  logOnce(`📋 伪造sessionId: ${fakeValue}`, "vscode-session-id-fake");
                  log("✅ 成功替换会话ID");
                } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId % 10 === 0) {
                  log(`🎭 拦截VSCode会话ID访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.sessionId}次)`);
                }
                return fakeValue;
              }
              if (envProp === "machineId") {
                INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId++;
                const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                const fakeValue = INTERCEPTOR_CONFIG.system.machineId;
                if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId === 1) {
                  logOnce("🎭 拦截VSCode机器ID访问", "vscode-machine-id-intercept");
                  logOnce(`📋 原始machineId: ${originalValue}`, "vscode-machine-id-original");
                  logOnce(`📋 伪造machineId: ${fakeValue}`, "vscode-machine-id-fake");
                  log("✅ 成功替换机器ID");
                } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId % 10 === 0) {
                  log(`🎭 拦截VSCode机器ID访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.machineId}次)`);
                }
                return fakeValue;
              }
              if (envProp === "isTelemetryEnabled") {
                INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled++;
                const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled === 1) {
                  logOnce("🎭 拦截VSCode遥测状态访问", "vscode-telemetry-intercept");
                  logOnce(`📋 原始isTelemetryEnabled: ${originalValue}`, "vscode-telemetry-original");
                  logOnce("📋 强制设置isTelemetryEnabled: false", "vscode-telemetry-fake");
                  log("✅ 成功禁用遥测功能");
                } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled % 10 === 0) {
                  log(`🎭 拦截VSCode遥测状态访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.isTelemetryEnabled}次)`);
                }
                return false;
              }
              if (envProp === "language") {
                INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language++;
                const originalValue = Reflect.get(envTarget, envProp, envReceiver);
                if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language === 1) {
                  logOnce("🎭 拦截VSCode语言环境访问", "vscode-language-intercept");
                  logOnce(`📋 原始language: ${originalValue}`, "vscode-language-original");
                  logOnce("📋 强制设置language: en-US", "vscode-language-fake");
                  log("✅ 成功统一语言环境");
                } else if (INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language % 10 === 0) {
                  log(`🎭 拦截VSCode语言环境访问 (第${INTERCEPTOR_CONFIG.vscodeEnvAccessCount.language}次)`);
                }
                return "en-US";
              }
              const value = Reflect.get(envTarget, envProp, envReceiver);
              if (typeof envProp === "string" && !envProp.startsWith("_")) {
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
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          const randomVSCodeVersion = globalObj._augmentVSCodeVersionConfig ? globalObj._augmentVSCodeVersionConfig.getCurrentVersion() : "1.96.0";
          return {
            version: randomVSCodeVersion,
            commands: { registerCommand: () => ({}) },
            window: {
              showInformationMessage: () => Promise.resolve(),
              showErrorMessage: () => Promise.resolve(),
              createOutputChannel: () => ({
                appendLine: () => {
                },
                show: () => {
                },
                dispose: () => {
                }
              })
            },
            workspace: {
              getConfiguration: () => ({
                get: () => void 0,
                has: () => false,
                inspect: () => void 0,
                update: () => Promise.resolve()
              })
            },
            authentication: {
              getSession: () => Promise.resolve(null),
              onDidChangeSessions: { dispose: () => {
              } }
            },
            env: new Proxy({
              uriScheme: "vscode",
              sessionId: SessionManager.getMainSessionId(),
              machineId: INTERCEPTOR_CONFIG.system.machineId,
              isTelemetryEnabled: false,
              language: "en-US"
            }, {
              get: function(target, prop, receiver) {
                const value = Reflect.get(target, prop, receiver);
                if (prop === "sessionId") {
                  log("🎭 模拟VSCode对象 - 访问sessionId");
                  log(`📋 返回伪造sessionId: ${value}`);
                } else if (prop === "machineId") {
                  log("🎭 模拟VSCode对象 - 访问machineId");
                  log(`📋 返回伪造machineId: ${value}`);
                } else if (prop === "uriScheme") {
                  log("🎭 模拟VSCode对象 - 访问uriScheme");
                  log(`📋 返回伪造uriScheme: ${value}`);
                } else if (prop === "isTelemetryEnabled") {
                  log("🎭 模拟VSCode对象 - 访问isTelemetryEnabled");
                  log("📋 强制返回isTelemetryEnabled: false");
                } else if (prop === "language") {
                  log("🎭 模拟VSCode对象 - 访问language");
                  log("📋 强制返回language: en-US");
                }
                return value;
              }
            })
          };
        }
      };
    }
  });

  // src/interceptors/system-api.js
  var SystemApiInterceptor;
  var init_system_api = __esm({
    "src/interceptors/system-api.js"() {
      init_config();
      init_logger();
      SystemApiInterceptor = {
        /**
         * 初始化系统API拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enableSystemApiInterception) {
            return;
          }
          log("🖥️ 初始化系统API拦截...");
          this.interceptProcessObject();
          this.interceptOSModule();
          log("✅ 系统API拦截设置完成");
        },
        /**
         * 拦截process对象
         */
        interceptProcessObject() {
          if (typeof process !== "undefined") {
            if (process.platform) {
              Object.defineProperty(process, "platform", {
                get: function() {
                  return INTERCEPTOR_CONFIG.system.platform;
                },
                configurable: true,
                enumerable: true
              });
              log(`🎭 已拦截 process.platform: ${INTERCEPTOR_CONFIG.system.platform}`);
            }
            if (process.arch) {
              Object.defineProperty(process, "arch", {
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
          if (typeof __require !== "undefined") {
            const originalRequire = __require;
            __require = function(moduleName) {
              const module = originalRequire.apply(this, arguments);
              if (moduleName === "os") {
                logOnce("🖥️ 拦截OS模块...", "os-module-intercept");
                return SystemApiInterceptor.createOSProxy(module);
              }
              return module;
            };
            Object.setPrototypeOf(__require, originalRequire);
            Object.getOwnPropertyNames(originalRequire).forEach((prop) => {
              if (prop !== "length" && prop !== "name") {
                __require[prop] = originalRequire[prop];
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
                case "platform":
                  return function() {
                    INTERCEPTOR_CONFIG.systemAccessCount.platform++;
                    if (INTERCEPTOR_CONFIG.systemAccessCount.platform === 1) {
                      log(`🎭 拦截 os.platform(): ${INTERCEPTOR_CONFIG.system.platform}`);
                    } else if (INTERCEPTOR_CONFIG.systemAccessCount.platform % 10 === 0) {
                      log(`🎭 拦截 os.platform(): ${INTERCEPTOR_CONFIG.system.platform} (第${INTERCEPTOR_CONFIG.systemAccessCount.platform}次访问)`);
                    }
                    return INTERCEPTOR_CONFIG.system.platform;
                  };
                case "arch":
                  return function() {
                    INTERCEPTOR_CONFIG.systemAccessCount.arch++;
                    if (INTERCEPTOR_CONFIG.systemAccessCount.arch === 1) {
                      log(`🎭 拦截 os.arch(): ${INTERCEPTOR_CONFIG.system.arch}`);
                    } else if (INTERCEPTOR_CONFIG.systemAccessCount.arch % 10 === 0) {
                      log(`🎭 拦截 os.arch(): ${INTERCEPTOR_CONFIG.system.arch} (第${INTERCEPTOR_CONFIG.systemAccessCount.arch}次访问)`);
                    }
                    return INTERCEPTOR_CONFIG.system.arch;
                  };
                case "hostname":
                  return function() {
                    INTERCEPTOR_CONFIG.systemAccessCount.hostname++;
                    if (INTERCEPTOR_CONFIG.systemAccessCount.hostname === 1) {
                      log(`🎭 拦截 os.hostname(): ${INTERCEPTOR_CONFIG.system.hostname}`);
                    } else if (INTERCEPTOR_CONFIG.systemAccessCount.hostname % 10 === 0) {
                      log(`🎭 拦截 os.hostname(): ${INTERCEPTOR_CONFIG.system.hostname} (第${INTERCEPTOR_CONFIG.systemAccessCount.hostname}次访问)`);
                    }
                    return INTERCEPTOR_CONFIG.system.hostname;
                  };
                case "type":
                  return function() {
                    INTERCEPTOR_CONFIG.systemAccessCount.type++;
                    if (INTERCEPTOR_CONFIG.systemAccessCount.type === 1) {
                      log(`🎭 拦截 os.type(): ${INTERCEPTOR_CONFIG.system.type}`);
                    } else if (INTERCEPTOR_CONFIG.systemAccessCount.type % 10 === 0) {
                      log(`🎭 拦截 os.type(): ${INTERCEPTOR_CONFIG.system.type} (第${INTERCEPTOR_CONFIG.systemAccessCount.type}次访问)`);
                    }
                    return INTERCEPTOR_CONFIG.system.type;
                  };
                case "release":
                case "version":
                  return function() {
                    const countKey = prop === "release" ? "release" : "version";
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
    }
  });

  // src/interceptors/system-command.js
  var SystemCommandInterceptor;
  var init_system_command = __esm({
    "src/interceptors/system-command.js"() {
      init_config();
      init_logger();
      init_system_info_generator();
      SystemCommandInterceptor = {
        /**
         * Git命令配置表（保持向后兼容）
         * 定义敏感Git命令的匹配模式和替换策略
         */
        commandConfig: {
          // 用户配置相关命令
          userConfig: {
            patterns: [
              "git config user.email",
              "git config user.name",
              "git config --get user.email",
              "git config --get user.name",
              "git config --global user.email",
              "git config --global user.name"
            ],
            shouldReplace: (command, error, stdout, stderr) => {
              return !error && stdout && stdout.trim().length > 0;
            }
          },
          // 远程仓库URL相关命令
          remoteUrl: {
            patterns: [
              "git config --get remote.origin.url",
              "git remote get-url origin",
              "git remote get-url",
              "git remote -v"
            ],
            shouldReplace: (command, error, stdout, stderr) => {
              if (!error && stdout && stdout.trim().length > 0) {
                const output = stdout.trim();
                const isValidGitUrl = SystemCommandInterceptor.isValidGitUrl(output);
                if (isValidGitUrl) {
                  const firstLine = output.split("\n")[0];
                  const displayOutput = output.includes("\n") ? `${firstLine}... (${output.split("\n").length} 行)` : output;
                  log(`🔍 检测到真实Git仓库URL，将进行替换: ${displayOutput}`);
                  return true;
                } else {
                  log(`💡 输出不是有效的Git URL，不进行替换: ${output.substring(0, 100)}${output.length > 100 ? "..." : ""}`);
                  return false;
                }
              }
              if (error || stderr) {
                const errorMessage = (stderr || error?.message || "").toLowerCase();
                const notGitRepoErrors = [
                  "fatal: not a git repository",
                  "not a git repository",
                  "fatal: no such remote",
                  "fatal: no upstream configured",
                  "fatal: 'origin' does not appear to be a git repository"
                ];
                const systemErrors = [
                  "spawn cmd.exe enoent",
                  "spawn git enoent",
                  "enoent",
                  "command not found",
                  "is not recognized as an internal or external command",
                  "no such file or directory",
                  "permission denied",
                  "access denied",
                  "cannot access",
                  "file not found"
                ];
                const isNotGitRepo = notGitRepoErrors.some(
                  (errorPattern) => errorMessage.includes(errorPattern)
                );
                const isSystemError = systemErrors.some(
                  (errorPattern) => errorMessage.includes(errorPattern)
                );
                if (isNotGitRepo) {
                  log(`💡 检测到非Git仓库错误，不进行替换: ${errorMessage}`);
                  return false;
                } else if (isSystemError) {
                  log(`🚫 检测到系统级错误，不进行替换: ${errorMessage}`);
                  return false;
                } else {
                  log(`🔍 检测到其他Git错误，可能需要替换: ${errorMessage}`);
                  return true;
                }
              }
              return false;
            }
          },
          // 其他敏感命令
          other: {
            patterns: [
              "git config --list",
              "git log --author",
              "git log --pretty"
            ],
            shouldReplace: (command, error, stdout, stderr) => {
              return !error && stdout && stdout.trim().length > 0;
            }
          }
        },
        /**
         * 初始化系统命令拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enableGitCommandInterception) {
            return;
          }
          log("🔧 初始化系统命令拦截...");
          this.interceptChildProcess();
          log("✅ 系统命令拦截设置完成");
        },
        /**
         * 拦截child_process模块
         */
        interceptChildProcess() {
          if (typeof __require !== "undefined") {
            const originalRequire = __require;
            __require = function(moduleName) {
              const module = originalRequire.apply(this, arguments);
              if (moduleName === "child_process") {
                logOnce("🔧 拦截child_process模块...", "child-process-module-intercept");
                return SystemCommandInterceptor.createChildProcessProxy(module);
              }
              return module;
            };
            Object.setPrototypeOf(__require, originalRequire);
            Object.getOwnPropertyNames(originalRequire).forEach((prop) => {
              if (prop !== "length" && prop !== "name") {
                __require[prop] = originalRequire[prop];
              }
            });
          }
        },
        /**
         * 统一的系统命令分析方法（扩展版）
         * @param {string} command - 要分析的命令
         * @param {Error|null} error - 执行错误
         * @param {string} stdout - 标准输出
         * @param {string} stderr - 错误输出
         * @returns {Object} 匹配结果 {isSensitive: boolean, shouldReplace: boolean, commandType: string}
         */
        analyzeSystemCommand(command, error = null, stdout = "", stderr = "") {
          if (typeof command !== "string") {
            return { isSensitive: false, shouldReplace: false, commandType: null };
          }
          const normalizedCommand = command.toLowerCase().trim();
          if (normalizedCommand.includes("ioreg")) {
            log(`🔍 检测到ioreg命令: ${command}`);
            let ioregType = "general";
            if (normalizedCommand.includes("-c ioplatformexpertdevice") || normalizedCommand.includes("-c IOPlatformExpertDevice")) {
              ioregType = "platform";
            } else if (normalizedCommand.includes("-p iousb") || normalizedCommand.includes("-p IOUSB")) {
              ioregType = "usb";
            }
            return {
              isSensitive: true,
              shouldReplace: true,
              commandType: "ioreg",
              ioregType
            };
          }
          if (normalizedCommand.includes("reg query") || normalizedCommand.includes("reg.exe query") || normalizedCommand.includes("wmic") || normalizedCommand.includes("systeminfo")) {
            log(`🔍 检测到Windows注册表命令: ${command}`);
            return {
              isSensitive: true,
              shouldReplace: true,
              commandType: "registry"
            };
          }
          if (normalizedCommand.includes("git ") || normalizedCommand.startsWith("git")) {
            const gitAnalysis = this.analyzeGitCommand(command, error, stdout, stderr);
            return {
              isSensitive: gitAnalysis.isSensitive,
              shouldReplace: gitAnalysis.shouldReplace,
              commandType: "git",
              configType: gitAnalysis.configType
            };
          }
          return { isSensitive: false, shouldReplace: false, commandType: null };
        },
        /**
         * 统一的Git命令匹配和判断方法
         * @param {string} command - Git命令
         * @param {Error|null} error - 执行错误
         * @param {string} stdout - 标准输出
         * @param {string} stderr - 错误输出
         * @returns {Object} 匹配结果 {isSensitive: boolean, shouldReplace: boolean, configType: string}
         */
        analyzeGitCommand(command, error = null, stdout = "", stderr = "") {
          if (typeof command !== "string") {
            return { isSensitive: false, shouldReplace: false, configType: null };
          }
          const isGitCommand = command.includes("git ") || command.startsWith("git");
          if (!isGitCommand) {
            return { isSensitive: false, shouldReplace: false, configType: null };
          }
          const normalizedCommand = command.toLowerCase().replace(/\s+/g, " ").trim();
          for (const [configType, config] of Object.entries(this.commandConfig)) {
            const isMatch = config.patterns.some(
              (pattern) => normalizedCommand.includes(pattern.toLowerCase())
            );
            if (isMatch) {
              const shouldReplace = config.shouldReplace(command, error, stdout, stderr);
              return {
                isSensitive: true,
                shouldReplace,
                configType
              };
            }
          }
          return { isSensitive: false, shouldReplace: false, configType: null };
        },
        /**
         * 创建child_process模块代理
         * @param {Object} originalCP - 原始child_process模块
         * @returns {Proxy} child_process模块代理
         */
        createChildProcessProxy(originalCP) {
          const self2 = this;
          return new Proxy(originalCP, {
            get(target, prop) {
              if (prop === "exec") {
                return function(command, options, callback) {
                  const analysis = self2.analyzeSystemCommand(command);
                  if (analysis.isSensitive) {
                    log(`🔍 检测到敏感系统exec命令: ${command} (类型: ${analysis.commandType})`);
                    const originalExec = target[prop].bind(target);
                    if (typeof options === "function") {
                      callback = options;
                      options = {};
                    }
                    return originalExec(command, options, (error, stdout, stderr) => {
                      const finalAnalysis = self2.analyzeSystemCommand(command, error, stdout, stderr);
                      if (finalAnalysis.shouldReplace) {
                        let fakeOutput = stdout;
                        switch (finalAnalysis.commandType) {
                          case "ioreg":
                            fakeOutput = self2.spoofIoregOutput(stdout, finalAnalysis.ioregType);
                            log(`🚫 拦截并替换ioreg命令输出 (${finalAnalysis.ioregType}): ${command}`);
                            break;
                          case "registry":
                            fakeOutput = self2.spoofWindowsRegistryOutput(stdout, command);
                            log(`🚫 拦截并替换Windows注册表命令输出: ${command}`);
                            break;
                          case "git":
                            fakeOutput = self2.getFakeGitResponse(command);
                            log(`🚫 拦截并替换Git命令输出: ${command}`);
                            break;
                        }
                        log(`🎭 生成假系统信息完成`);
                        if (callback) {
                          callback(null, fakeOutput, stderr);
                        }
                      } else {
                        log(`✅ 系统命令无需拦截，返回原始结果: ${command}`);
                        if (callback) {
                          callback(error, stdout, stderr);
                        }
                      }
                    });
                  }
                  return target[prop].apply(target, arguments);
                };
              }
              return target[prop];
            }
          });
        },
        /**
         * 增强的Git URL验证方法
         * @param {string} url - 待检查的URL
         * @returns {boolean} 是否为有效的Git URL
         */
        isValidGitUrl(url) {
          if (!url || typeof url !== "string")
            return false;
          const trimmedUrl = url.trim();
          const lines = trimmedUrl.split("\n");
          if (lines.length > 1) {
            return lines.some((line) => this.isValidGitUrl(line.trim()));
          }
          const urlMatch = trimmedUrl.match(/(?:https?:\/\/|git@|git:\/\/)[^\s]+/);
          const actualUrl = urlMatch ? urlMatch[0] : trimmedUrl;
          const gitUrlPatterns = [
            // HTTPS格式 - 更宽松的匹配
            /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/,
            /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+$/,
            // SSH格式
            /^git@[a-zA-Z0-9.-]+:[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/,
            /^git@[a-zA-Z0-9.-]+:[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+$/,
            // Git协议格式
            /^git:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/,
            /^git:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+$/,
            // 本地路径格式
            /^\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/,
            /^\.\.?\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/,
            // 文件协议格式
            /^file:\/\/\/[a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=-]+\.git$/
          ];
          const isValidFormat = gitUrlPatterns.some((pattern) => pattern.test(actualUrl));
          if (isValidFormat) {
            log(`✅ 有效的Git URL格式: ${actualUrl}`);
            return true;
          }
          const gitHostingDomains = [
            "github.com",
            "gitlab.com",
            "bitbucket.org",
            "gitee.com",
            "coding.net",
            "dev.azure.com",
            "visualstudio.com",
            "sourceforge.net",
            "codeberg.org"
          ];
          const containsGitDomain = gitHostingDomains.some(
            (domain) => actualUrl.toLowerCase().includes(domain)
          );
          if (containsGitDomain) {
            log(`✅ 包含Git托管服务域名: ${actualUrl}`);
            return true;
          }
          log(`❌ 无效的Git URL格式: ${actualUrl}`);
          return false;
        },
        /**
         * 生成假的Git响应
         * @param {string} command - Git命令
         * @returns {string} 假响应
         */
        getFakeGitResponse(command) {
          const normalizedCommand = command.toLowerCase();
          if (normalizedCommand.includes("user.email")) {
            const fakeEmail = this.generateFakeEmail();
            log(`🎭 生成假Git邮箱: ${fakeEmail}`);
            return fakeEmail;
          } else if (normalizedCommand.includes("user.name")) {
            const fakeName = this.generateFakeName();
            log(`🎭 生成假Git用户名: ${fakeName}`);
            return fakeName;
          } else if (normalizedCommand.includes("remote") && normalizedCommand.includes("url")) {
            const fakeUrl = this.generateFakeGitUrl();
            log(`🎭 生成假Git仓库URL: ${fakeUrl}`);
            return fakeUrl;
          } else if (normalizedCommand.includes("config --list")) {
            const fakeConfig = this.generateFakeGitConfig();
            log(`🎭 生成假Git配置列表`);
            return fakeConfig;
          } else {
            log(`🎭 Git命令无特定响应，返回空字符串: ${command}`);
            return "";
          }
        },
        /**
         * 生成假的Git邮箱
         * @returns {string} 假邮箱
         */
        generateFakeEmail() {
          const domains = ["gmail.com", "outlook.com", "yahoo.com", "hotmail.com", "icloud.com"];
          const usernames = ["john.doe", "jane.smith", "alex.wilson", "sarah.johnson", "mike.brown"];
          const username = usernames[Math.floor(Math.random() * usernames.length)];
          const domain = domains[Math.floor(Math.random() * domains.length)];
          return `${username}@${domain}`;
        },
        /**
         * 生成假的Git用户名
         * @returns {string} 假用户名
         */
        generateFakeName() {
          const firstNames = ["John", "Jane", "Alex", "Sarah", "Mike", "Emily", "David", "Lisa"];
          const lastNames = ["Doe", "Smith", "Wilson", "Johnson", "Brown", "Davis", "Miller", "Garcia"];
          const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
          const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
          return `${firstName} ${lastName}`;
        },
        /**
         * 生成假的Git仓库URL
         * @returns {string} 假仓库URL
         */
        generateFakeGitUrl() {
          const hosts = ["github.com", "gitlab.com", "bitbucket.org"];
          const users = ["johndoe", "janesmith", "alexwilson", "sarahjohnson"];
          const repos = ["my-project", "awesome-app", "cool-tool", "sample-repo"];
          const host = hosts[Math.floor(Math.random() * hosts.length)];
          const user = users[Math.floor(Math.random() * users.length)];
          const repo = repos[Math.floor(Math.random() * repos.length)];
          return `https://${host}/${user}/${repo}.git`;
        },
        /**
         * 生成假的Git配置列表
         * @returns {string} 假配置列表
         */
        generateFakeGitConfig() {
          const fakeEmail = this.generateFakeEmail();
          const fakeName = this.generateFakeName();
          const fakeUrl = this.generateFakeGitUrl();
          return `user.name=${fakeName}
user.email=${fakeEmail}
remote.origin.url=${fakeUrl}
remote.origin.fetch=+refs/heads/*:refs/remotes/origin/*
core.repositoryformatversion=0
core.filemode=true
core.bare=false
core.logallrefupdates=true`;
        },
        /**
         * 伪造ioreg命令输出
         * @param {string} output - 原始输出
         * @param {string} ioregType - ioreg命令类型 ('platform', 'usb', 'general')
         * @returns {string} 伪造后的输出
         */
        spoofIoregOutput(output, ioregType = "general") {
          if (!output || typeof output !== "string" || output.trim().length === 0) {
            return this.generateFakeIoregOutput(ioregType);
          }
          let spoofed = output;
          const fakeUUID = INTERCEPTOR_CONFIG.system.macUUID;
          const fakeSerial = INTERCEPTOR_CONFIG.system.macSerial;
          const fakeBoardId = INTERCEPTOR_CONFIG.system.macBoardId;
          const uuidPattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi;
          spoofed = spoofed.replace(uuidPattern, fakeUUID);
          const serialPattern = /"IOPlatformSerialNumber" = "([^"]+)"/g;
          spoofed = spoofed.replace(serialPattern, `"IOPlatformSerialNumber" = "${fakeSerial}"`);
          const boardIdPattern = /Mac-[0-9A-F]{16}/gi;
          spoofed = spoofed.replace(boardIdPattern, fakeBoardId);
          log(`🎭 ioreg输出伪造完成 (${ioregType})`);
          return spoofed;
        },
        /**
         * 生成假的ioreg输出 - 完整版（从原始文件提取）
         * @param {string} ioregType - ioreg命令类型
         * @returns {string} 假的ioreg输出
         */
        generateFakeIoregOutput(ioregType) {
          const fakeUUID = INTERCEPTOR_CONFIG.system.macUUID;
          const fakeSerial = INTERCEPTOR_CONFIG.system.macSerial;
          const fakeBoardId = INTERCEPTOR_CONFIG.system.macBoardId;
          const fakeModel = INTERCEPTOR_CONFIG.system.macModel;
          const realArch = process.arch;
          const isAppleSilicon = realArch === "arm64";
          log(`🎭 生成假的ioreg输出 (类型: ${ioregType}), 使用型号: ${fakeModel}, 架构: ${realArch}`);
          switch (ioregType) {
            case "platform":
              const dynamicDeviceId = `0x${(4294967573 + Math.floor(Math.random() * 50)).toString(16)}`;
              const dynamicBusyTime = Math.floor(Math.random() * 10);
              const dynamicRetain = 45 + Math.floor(Math.random() * 15);
              if (isAppleSilicon) {
                const dynamicSystemMemory = Math.floor(Math.random() * 3) + 1;
                const systemMemoryHex = `000000000${dynamicSystemMemory.toString(16).padStart(7, "0")}00000000`;
                const dynamicSessionId2 = 1e5 + Math.floor(Math.random() * 1e4);
                const dynamicUserId = 500 + Math.floor(Math.random() * 10);
                const dynamicGroupId = 20 + Math.floor(Math.random() * 5);
                const dynamicCGSSessionId = 250 + Math.floor(Math.random() * 50);
                let compatibleValue, boardIdValue, targetTypeValue;
                if (fakeModel.includes("Macmini")) {
                  compatibleValue = `"${fakeModel}","J274AP"`;
                  boardIdValue = "Mac-747B3727A59523C5";
                  targetTypeValue = "Mac";
                } else if (fakeModel.includes("MacBookAir")) {
                  compatibleValue = `"${fakeModel}","J313AP"`;
                  boardIdValue = "Mac-827FB448E656EC26";
                  targetTypeValue = "Mac";
                } else if (fakeModel.includes("MacBookPro")) {
                  compatibleValue = `"${fakeModel}","J316sAP"`;
                  boardIdValue = "Mac-06F11FD93F0323C5";
                  targetTypeValue = "Mac";
                } else {
                  compatibleValue = `"${fakeModel}","J274AP"`;
                  boardIdValue = "Mac-747B3727A59523C5";
                  targetTypeValue = "Mac";
                }
                log(`🎭 生成M系列Mac platform输出 - 型号: ${fakeModel}, 内存: ${dynamicSystemMemory * 8}GB`);
                return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 24>
  +-o ${fakeModel}  <class IOPlatformExpertDevice, id ${dynamicDeviceId}, registered, matched, active, busy 0 (${dynamicBusyTime} ms), retain ${dynamicRetain}>
      {
        "IONVRAM-OF-lwvm-compatible" = "J274"
        "board-id" = <"${boardIdValue}">
        "secure-root-prefix" = "com.apple.xbs"
        "IOPlatformUUID" = "${fakeUUID}"
        "system-memory-size" = <${systemMemoryHex}>
        "serial-number" = <"${fakeSerial}">
        "IOConsoleUsers" = ({"kCGSSessionUserNameKey"="user","kCGSSessionOnConsoleKey"=Yes,"kSCSecuritySessionID"=${dynamicSessionId2},"kCGSSessionLoginwindowSafeLogin"=No,"kCGSSessionID"=${dynamicCGSSessionId},"kCGSSessionSystemSafeBoot"=No,"kCGSSessionAuditID"=${dynamicSessionId2},"kCGSSessionUserIDKey"=${dynamicUserId},"kCGSSessionGroupIDKey"=${dynamicGroupId}})
        "target-type" = <"${targetTypeValue}">
        "name" = <"product">
        "firmware-version" = <"iBoot-8419.80.7">
        "compatible" = <${compatibleValue}>
        "IOPlatformSerialNumber" = "${fakeSerial}"
        "system-type" = <01>
        "model" = <"${fakeModel}">
        "manufacturer" = <"Apple Inc.">
        "product-name" = <"${fakeModel}">
      }`;
              } else {
                log(`🎭 生成Intel Mac platform输出 - 型号: ${fakeModel}`);
                return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 24>
  +-o ${fakeModel}  <class IOPlatformExpertDevice, id ${dynamicDeviceId}, registered, matched, active, busy 0 (${dynamicBusyTime} ms), retain ${dynamicRetain}>
      {
        "IOInterruptSpecifiers" = (<0900000005000000>)
        "IOPolledInterface" = "SMCPolledInterface is not serializable"
        "IOPlatformUUID" = "${fakeUUID}"
        "serial-number" = <"${fakeSerial}">
        "platform-feature" = <3200000000000000>
        "IOPlatformSystemSleepPolicy" = <534c505402000a000800000008000000000000000000000005000000000000000501000001000000000040000000400000001000000010000700000000000000>
        "IOBusyInterest" = "IOCommand is not serializable"
        "target-type" = <"Mac">
        "IOInterruptControllers" = ("io-apic-0")
        "name" = <"/">
        "version" = <"1.0">
        "manufacturer" = <"Apple Inc.">
        "compatible" = <"${fakeModel}">
        "product-name" = <"${fakeModel}">
        "IOPlatformSerialNumber" = "${fakeSerial}"
        "IOConsoleSecurityInterest" = "IOCommand is not serializable"
        "clock-frequency" = <0084d717>
        "model" = <"${fakeModel}">
        "board-id" = <"${fakeBoardId}">
        "bridge-model" = <"J152fAP">
        "system-type" = <02>
      }`;
              }
            case "usb":
              const dynamicSessionId = Math.floor(Math.random() * 1e9) + 9e8;
              const generateDeviceId = (base) => `0x${(base + Math.floor(Math.random() * 100)).toString(16)}`;
              const generateUsbAddress = () => Math.floor(Math.random() * 6) + 2;
              const generateLocationId = (base) => base + Math.floor(Math.random() * 1e3);
              if (isAppleSilicon) {
                const dynamicT6000Id1 = `0x${(4294967681 + Math.floor(Math.random() * 20)).toString(16)}`;
                const dynamicT6000Id2 = `0x${(4294967681 + Math.floor(Math.random() * 20)).toString(16)}`;
                const dynamicXHCId1 = `0x${(4294968049 + Math.floor(Math.random() * 30)).toString(16)}`;
                const dynamicXHCId2 = `0x${(4294968081 + Math.floor(Math.random() * 30)).toString(16)}`;
                const dynamicRootHubId1 = `0x${(4294968052 + Math.floor(Math.random() * 50)).toString(16)}`;
                const dynamicRootHubId2 = `0x${(4294968084 + Math.floor(Math.random() * 50)).toString(16)}`;
                const dynamicRetain1 = 20 + Math.floor(Math.random() * 10);
                const dynamicRetain2 = 12 + Math.floor(Math.random() * 8);
                const includeKeyboard = Math.random() > 0.05;
                const includeAmbientLight = Math.random() > 0.1;
                const includeUSBCAdapter = Math.random() > 0.4;
                const includeDellMonitor = Math.random() > 0.3;
                const includeUnifyingReceiver = Math.random() > 0.5;
                const includeUSBDrive = Math.random() > 0.6;
                const includeiPhone = Math.random() > 0.4;
                log(`🎭 生成M系列Mac动态USB设备树 - 会话ID: ${dynamicSessionId}, 外设: 键盘=${includeKeyboard}, 环境光=${includeAmbientLight}, USB-C适配器=${includeUSBCAdapter}, Dell显示器=${includeDellMonitor}, 罗技接收器=${includeUnifyingReceiver}, U盘=${includeUSBDrive}, iPhone=${includeiPhone}`);
                return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 26, depth 0>
  +-o AppleT6000IO  <class AppleT6000IO, id ${dynamicT6000Id1}, retain 11, depth 1>
    +-o IOUSBHostController@01000000  <class AppleT6000USBXHCI, id ${dynamicXHCId1}, retain 28, depth 2>
    | +-o AppleUSBRootHubDevice  <class AppleUSBRootHubDevice, id ${dynamicRootHubId1}, retain ${dynamicRetain1}, depth 3>
    |   {
    |     "iManufacturer" = 1
    |     "bNumConfigurations" = 1
    |     "idProduct" = 32771
    |     "bcdDevice" = 256
    |     "Bus Power Available" = 2500
    |     "bMaxPacketSize0" = 64
    |     "iProduct" = 2
    |     "iSerialNumber" = 0
    |     "bDeviceClass" = 9
    |     "Built-In" = Yes
    |     "locationID" = ${generateLocationId(16777216)}
    |     "bDeviceSubClass" = 0
    |     "bcdUSB" = 768
    |     "sessionID" = ${dynamicSessionId}
    |     "USBSpeed" = 5
    |     "idVendor" = 1452
    |     "IOUserClient" = "IOUSBHostUserClient"
    |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |     "Device Speed" = 3
    |     "bDeviceProtocol" = 1
    |     "IOCFPlugInTypes" = {"9dc7b780-9ec0-11d4-a54f-000a27052861"="IOUSBHostFamily.kext/Contents/PlugIns/IOUSBHostHIDDevice.kext"}
    |     "IOGeneralInterest" = "IOCommand is not serializable"
    |     "IOClassNameOverride" = "IOUSBDevice"
    |   }
    |   +-o AppleUSB20Hub@01100000  <class AppleUSB20Hub, id ${generateDeviceId(4294968054)}, retain 16, depth 4>
    |   | {
    |   |   "iManufacturer" = 1
    |   |   "bNumConfigurations" = 1
    |   |   "idProduct" = 10781
    |   |   "bcdDevice" = 256
    |   |   "Bus Power Available" = 2500
    |   |   "USB Address" = 1
    |   |   "bMaxPacketSize0" = 64
    |   |   "iProduct" = 2
    |   |   "iSerialNumber" = 0
    |   |   "bDeviceClass" = 9
    |   |   "Built-In" = Yes
    |   |   "locationID" = ${generateLocationId(17825792)}
    |   |   "bDeviceSubClass" = 0
    |   |   "bcdUSB" = 512
    |   |   "sessionID" = ${dynamicSessionId}
    |   |   "USBSpeed" = 2
    |   |   "idVendor" = 1452
    |   |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |   |   "Device Speed" = 2
    |   |   "bDeviceProtocol" = 1
    |   |   "PortNum" = 1
    |   | }${includeKeyboard ? `
    |   | +-o Apple Internal Keyboard / Trackpad@01110000  <class IOUSBHostDevice, id ${generateDeviceId(4294968064)}, retain 20, depth 5>
    |   | | {
    |   | |   "iManufacturer" = 1
    |   | |   "bNumConfigurations" = 1
    |   | |   "idProduct" = 796
    |   | |   "bcdDevice" = 545
    |   | |   "Bus Power Available" = 500
    |   | |   "USB Address" = ${generateUsbAddress()}
    |   | |   "bMaxPacketSize0" = 64
    |   | |   "iProduct" = 2
    |   | |   "iSerialNumber" = 3
    |   | |   "bDeviceClass" = 0
    |   | |   "Built-In" = Yes
    |   | |   "locationID" = ${generateLocationId(17891328)}
    |   | |   "bDeviceSubClass" = 0
    |   | |   "bcdUSB" = 512
    |   | |   "sessionID" = ${dynamicSessionId}
    |   | |   "USBSpeed" = 2
    |   | |   "idVendor" = 1452
    |   | |   "USB Serial Number" = "${fakeSerial}"
    |   | |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |   | |   "Device Speed" = 2
    |   | |   "bDeviceProtocol" = 0
    |   | |   "PortNum" = 1
    |   | | }
    |   | | ` : ""}${includeAmbientLight ? `
    |   | +-o Ambient Light Sensor@01120000  <class IOUSBHostDevice, id ${generateDeviceId(4294968065)}, retain 12, depth 5>
    |   |   {
    |   |     "iManufacturer" = 1
    |   |     "bNumConfigurations" = 1
    |   |     "idProduct" = 33026
    |   |     "bcdDevice" = 0
    |   |     "Bus Power Available" = 500
    |   |     "USB Address" = ${generateUsbAddress()}
    |   |     "bMaxPacketSize0" = 64
    |   |     "iProduct" = 2
    |   |     "iSerialNumber" = 0
    |   |     "bDeviceClass" = 0
    |   |     "Built-In" = Yes
    |   |     "locationID" = ${generateLocationId(17956864)}
    |   |     "bDeviceSubClass" = 0
    |   |     "bcdUSB" = 512
    |   |     "sessionID" = ${dynamicSessionId}
    |   |     "USBSpeed" = 2
    |   |     "idVendor" = 1452
    |   |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |   |     "Device Speed" = 2
    |   |     "bDeviceProtocol" = 0
    |   |     "PortNum" = 2
    |   |   }` : ""}
    |   |
    |   +-o AppleUSB30Hub@01200000  <class AppleUSB30Hub, id ${generateDeviceId(4294968069)}, retain 18, depth 4>
    |     {
    |       "iManufacturer" = 1
    |       "bNumConfigurations" = 1
    |       "idProduct" = 10787
    |       "bcdDevice" = 256
    |       "Bus Power Available" = 2500
    |       "USB Address" = ${generateUsbAddress()}
    |       "bMaxPacketSize0" = 9
    |       "iProduct" = 2
    |       "iSerialNumber" = 0
    |       "bDeviceClass" = 9
    |       "Built-In" = Yes
    |       "locationID" = ${generateLocationId(18874368)}
    |       "bDeviceSubClass" = 0
    |       "bcdUSB" = 768
    |       "sessionID" = ${dynamicSessionId}
    |       "USBSpeed" = 4
    |       "idVendor" = 1452
    |       "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |       "Device Speed" = 3
    |       "bDeviceProtocol" = 3
    |       "PortNum" = 2
    |     }${includeUSBCAdapter ? `
    |     +-o USB C Video Adaptor@01210000  <class IOUSBHostDevice, id ${generateDeviceId(4294969533)}, retain 14, depth 5>
    |     | {
    |     |   "iManufacturer" = 1
    |     |   "bNumConfigurations" = 1
    |     |   "idProduct" = 16658
    |     |   "bcdDevice" = 272
    |     |   "Bus Power Available" = 900
    |     |   "USB Address" = ${generateUsbAddress()}
    |     |   "bMaxPacketSize0" = 9
    |     |   "iProduct" = 2
    |     |   "iSerialNumber" = 0
    |     |   "bDeviceClass" = 9
    |     |   "Built-In" = No
    |     |   "locationID" = ${generateLocationId(18939904)}
    |     |   "bDeviceSubClass" = 0
    |     |   "bcdUSB" = 768
    |     |   "sessionID" = ${dynamicSessionId}
    |     |   "USBSpeed" = 4
    |     |   "idVendor" = 8118
    |     |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |     |   "Device Speed" = 3
    |     |   "bDeviceProtocol" = 1
    |     |   "PortNum" = 1
    |     | }
    |     | +-o USB2.0 Hub@01210000  <class IOUSBHostDevice, id ${generateDeviceId(4294969549)}, retain 15, depth 6>
    |     |   {
    |     |     "iManufacturer" = 1
    |     |     "bNumConfigurations" = 1
    |     |     "idProduct" = 2337
    |     |     "bcdDevice" = 4640
    |     |     "Bus Power Available" = 500
    |     |     "USB Address" = ${generateUsbAddress()}
    |     |     "bMaxPacketSize0" = 64
    |     |     "iProduct" = 2
    |     |     "iSerialNumber" = 0
    |     |     "bDeviceClass" = 9
    |     |     "Built-In" = No
    |     |     "locationID" = ${generateLocationId(18939904)}
    |     |     "bDeviceSubClass" = 0
    |     |     "bcdUSB" = 512
    |     |     "sessionID" = ${dynamicSessionId}
    |     |     "USBSpeed" = 2
    |     |     "idVendor" = 8118
    |     |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |     |     "Device Speed" = 2
    |     |     "bDeviceProtocol" = 2
    |     |     "PortNum" = 1
    |     |   }${includeUSBDrive ? `
    |     |   +-o Cruzer Blade@01214000  <class IOUSBHostDevice, id ${generateDeviceId(4294969555)}, retain 15, depth 7>
    |     |     {
    |     |       "iManufacturer" = 1
    |     |       "bNumConfigurations" = 1
    |     |       "idProduct" = 21845
    |     |       "bcdDevice" = 256
    |     |       "Bus Power Available" = 224
    |     |       "USB Address" = ${generateUsbAddress()}
    |     |       "bMaxPacketSize0" = 64
    |     |       "iProduct" = 2
    |     |       "iSerialNumber" = 3
    |     |       "bDeviceClass" = 0
    |     |       "Built-In" = No
    |     |       "locationID" = ${generateLocationId(18966016)}
    |     |       "bDeviceSubClass" = 0
    |     |       "bcdUSB" = 512
    |     |       "sessionID" = ${dynamicSessionId}
    |     |       "USBSpeed" = 2
    |     |       "idVendor" = 1921
    |     |       "USB Serial Number" = "20053538421F86B191E5"
    |     |       "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |     |       "Device Speed" = 2
    |     |       "bDeviceProtocol" = 0
    |     |       "PortNum" = 4
    |     |     }` : ""}
    |     |     ` : ""}${includeDellMonitor ? `
    |     +-o Dell U3223QE @01230000  <class IOUSBHostDevice, id ${generateDeviceId(4294969571)}, retain 15, depth 5>
    |       {
    |         "iManufacturer" = 1
    |         "bNumConfigurations" = 1
    |         "idProduct" = 8802
    |         "bcdDevice" = 256
    |         "Bus Power Available" = 900
    |         "USB Address" = ${generateUsbAddress()}
    |         "bMaxPacketSize0" = 9
    |         "iProduct" = 2
    |         "iSerialNumber" = 0
    |         "bDeviceClass" = 9
    |         "Built-In" = No
    |         "locationID" = ${generateLocationId(19070976)}
    |         "bDeviceSubClass" = 0
    |         "bcdUSB" = 768
    |         "sessionID" = ${dynamicSessionId}
    |         "USBSpeed" = 4
    |         "idVendor" = 1043
    |         "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |         "Device Speed" = 3
    |         "bDeviceProtocol" = 1
    |         "PortNum" = 3
    |       }${includeUnifyingReceiver ? `
    |       +-o USB2.0 Hub@01230000  <class IOUSBHostDevice, id ${generateDeviceId(4294969588)}, retain 14, depth 6>
    |         {
    |           "iManufacturer" = 1
    |           "bNumConfigurations" = 1
    |           "idProduct" = 8798
    |           "bcdDevice" = 256
    |           "Bus Power Available" = 500
    |           "USB Address" = ${generateUsbAddress()}
    |           "bMaxPacketSize0" = 64
    |           "iProduct" = 2
    |           "iSerialNumber" = 0
    |           "bDeviceClass" = 9
    |           "Built-In" = No
    |           "locationID" = ${generateLocationId(19070976)}
    |           "bDeviceSubClass" = 0
    |           "bcdUSB" = 512
    |           "sessionID" = ${dynamicSessionId}
    |           "USBSpeed" = 2
    |           "idVendor" = 1043
    |           "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |           "Device Speed" = 2
    |           "bDeviceProtocol" = 2
    |           "PortNum" = 1
    |         }
    |         +-o Unifying Receiver@01231000  <class IOUSBHostDevice, id ${generateDeviceId(4294969595)}, retain 16, depth 7>
    |           {
    |             "iManufacturer" = 1
    |             "bNumConfigurations" = 1
    |             "idProduct" = 49198
    |             "bcdDevice" = 4864
    |             "Bus Power Available" = 98
    |             "USB Address" = ${generateUsbAddress()}
    |             "bMaxPacketSize0" = 8
    |             "iProduct" = 2
    |             "iSerialNumber" = 0
    |             "bDeviceClass" = 255
    |             "Built-In" = No
    |             "locationID" = ${generateLocationId(19075072)}
    |             "bDeviceSubClass" = 0
    |             "bcdUSB" = 512
    |             "sessionID" = ${dynamicSessionId}
    |             "USBSpeed" = 1
    |             "idVendor" = 1133
    |             "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
    |             "Device Speed" = 1
    |             "bDeviceProtocol" = 0
    |             "PortNum" = 1
    |           }` : ""}` : ""}
    |
  +-o AppleT6000IO  <class AppleT6000IO, id ${dynamicT6000Id2}, retain 11, depth 1>
    +-o IOUSBHostController@00000000  <class AppleT6000USBXHCI, id ${dynamicXHCId2}, retain 20, depth 2>
      +-o AppleUSBRootHubDevice  <class AppleUSBRootHubDevice, id ${dynamicRootHubId2}, retain ${dynamicRetain2}, depth 3>
        {
          "iManufacturer" = 1
          "bNumConfigurations" = 1
          "idProduct" = 32771
          "bcdDevice" = 256
          "Bus Power Available" = 2500
          "bMaxPacketSize0" = 64
          "iProduct" = 2
          "iSerialNumber" = 0
          "bDeviceClass" = 9
          "Built-In" = Yes
          "locationID" = ${generateLocationId(0)}
          "bDeviceSubClass" = 0
          "bcdUSB" = 768
          "sessionID" = ${dynamicSessionId + 1}
          "USBSpeed" = 5
          "idVendor" = 1452
          "IOUserClient" = "IOUSBHostUserClient"
          "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
          "Device Speed" = 3
          "bDeviceProtocol" = 1
          "IOCFPlugInTypes" = {"9dc7b780-9ec0-11d4-a54f-000a27052861"="IOUSBHostFamily.kext/Contents/PlugIns/IOUSBHostHIDDevice.kext"}
          "IOGeneralInterest" = "IOCommand is not serializable"
          "IOClassNameOverride" = "IOUSBDevice"
        }
        +-o AppleUSB20Hub@00100000  <class AppleUSB20Hub, id ${generateDeviceId(4294968086)}, retain 13, depth 4>
        | {
        |   "iManufacturer" = 1
        |   "bNumConfigurations" = 1
        |   "idProduct" = 10781
        |   "bcdDevice" = 256
        |   "Bus Power Available" = 2500
        |   "USB Address" = 1
        |   "bMaxPacketSize0" = 64
        |   "iProduct" = 2
        |   "iSerialNumber" = 0
        |   "bDeviceClass" = 9
        |   "Built-In" = Yes
        |   "locationID" = ${generateLocationId(65536)}
        |   "bDeviceSubClass" = 0
        |   "bcdUSB" = 512
        |   "sessionID" = ${dynamicSessionId + 1}
        |   "USBSpeed" = 2
        |   "idVendor" = 1452
        |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
        |   "Device Speed" = 2
        |   "bDeviceProtocol" = 1
        |   "PortNum" = 1
        | }${includeiPhone ? `
        | +-o iPhone@00110000  <class IOUSBHostDevice, id ${generateDeviceId(4294969619)}, retain 20, depth 5>
        |   {
        |     "iManufacturer" = 1
        |     "bNumConfigurations" = 4
        |     "idProduct" = 4776
        |     "bcdDevice" = 768
        |     "Bus Power Available" = 500
        |     "USB Address" = ${generateUsbAddress()}
        |     "bMaxPacketSize0" = 64
        |     "iProduct" = 2
        |     "iSerialNumber" = 3
        |     "bDeviceClass" = 0
        |     "Built-In" = No
        |     "locationID" = ${generateLocationId(720896)}
        |     "bDeviceSubClass" = 0
        |     "bcdUSB" = 512
        |     "sessionID" = ${dynamicSessionId + 1}
        |     "USBSpeed" = 2
        |     "idVendor" = 1452
        |     "USB Serial Number" = "00008110-001A45142168801E"
        |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
        |     "Device Speed" = 2
        |     "bDeviceProtocol" = 0
        |     "PortNum" = 1
        |   }` : ""}
        |
        +-o AppleUSB30Hub@00200000  <class AppleUSB30Hub, id ${generateDeviceId(4294968101)}, retain 12, depth 4>
          {
            "iManufacturer" = 1
            "bNumConfigurations" = 1
            "idProduct" = 10787
            "bcdDevice" = 256
            "Bus Power Available" = 2500
            "USB Address" = ${generateUsbAddress()}
            "bMaxPacketSize0" = 9
            "iProduct" = 2
            "iSerialNumber" = 0
            "bDeviceClass" = 9
            "Built-In" = Yes
            "locationID" = ${generateLocationId(131072)}
            "bDeviceSubClass" = 0
            "bcdUSB" = 768
            "sessionID" = ${dynamicSessionId + 1}
            "USBSpeed" = 4
            "idVendor" = 1452
            "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
            "Device Speed" = 3
            "bDeviceProtocol" = 3
            "PortNum" = 2
          }`;
              } else {
                const dynamicRootHubId = `0x${(4294968107 + Math.floor(Math.random() * 50)).toString(16)}`;
                const dynamicRetain2 = 25 + Math.floor(Math.random() * 10);
                const dynamicXHCId = `0x${(4294968050 + Math.floor(Math.random() * 30)).toString(16)}`;
                const dynamicACPIId = `0x${(4294967576 + Math.floor(Math.random() * 20)).toString(16)}`;
                const dynamicExpertId = `0x${(4294967574 + Math.floor(Math.random() * 10)).toString(16)}`;
                const includeDellMonitor = Math.random() > 0.3;
                const includeT2Controller = Math.random() > 0.1;
                const includeCalDigit = Math.random() > 0.5;
                const includeWebcam = Math.random() > 0.4;
                const includeUSBDrive = Math.random() > 0.6;
                log(`🎭 生成Intel Mac动态USB设备树 - 会话ID: ${dynamicSessionId}, 外设: Dell显示器=${includeDellMonitor}, T2控制器=${includeT2Controller}, CalDigit=${includeCalDigit}, 摄像头=${includeWebcam}, U盘=${includeUSBDrive}`);
                return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 26, depth 0>
  +-o AppleACPIPlatformExpert  <class AppleACPIPlatformExpert, id ${dynamicExpertId}, retain 42, depth 1>
    +-o AppleACPIPCI  <class AppleACPIPCI, id ${dynamicACPIId}, retain 41, depth 2>
      +-o XHC1@14  <class AppleIntelCNLUSBXHCI, id ${dynamicXHCId}, retain 52, depth 3>
        +-o AppleUSBRootHubDevice  <class AppleUSBRootHubDevice, id ${dynamicRootHubId}, retain ${dynamicRetain2}, depth 4>
          {
            "iManufacturer" = 1
            "bNumConfigurations" = 1
            "idProduct" = 33282
            "bcdDevice" = 0
            "Bus Power Available" = 2500
            "bMaxPacketSize0" = 64
            "iProduct" = 2
            "iSerialNumber" = 0
            "bDeviceClass" = 9
            "Built-In" = Yes
            "locationID" = ${generateLocationId(337641472)}
            "bDeviceSubClass" = 0
            "bcdUSB" = 768
            "sessionID" = ${dynamicSessionId}
            "USBSpeed" = 5
            "idVendor" = 32902
            "IOUserClient" = "IOUSBHostUserClient"
            "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
            "Device Speed" = 3
            "bDeviceProtocol" = 1
            "IOCFPlugInTypes" = {"9dc7b780-9ec0-11d4-a54f-000a27052861"="IOUSBHostFamily.kext/Contents/PlugIns/IOUSBHostHIDDevice.kext"}
            "IOGeneralInterest" = "IOCommand is not serializable"
            "IOClassNameOverride" = "IOUSBDevice"
          }
          +-o HS01@14100000  <class IOUSBHostDevice, id ${generateDeviceId(4294968245)}, retain 12, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 2
          |   "idProduct" = 33076
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 2
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 64
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(336592896)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 512
          |   "bDeviceProtocol" = 1
          |   "PortNum" = 1
          | }
          |
          +-o HS02@14200000  <class IOUSBHostDevice, id ${generateDeviceId(4294968246)}, retain 15, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 2
          |   "idProduct" = 33076
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 2
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 64
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(337641472)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 512
          |   "bDeviceProtocol" = 1
          |   "PortNum" = 2
          | }${includeDellMonitor ? `
          | +-o Dell U3219Q @14200000  <class IOUSBHostDevice, id ${generateDeviceId(4294969425)}, retain 14, depth 6>
          |   {
          |     "iManufacturer" = 1
          |     "bNumConfigurations" = 1
          |     "idProduct" = 8746
          |     "bcdDevice" = 256
          |     "Bus Power Available" = 500
          |     "USB Address" = ${generateUsbAddress()}
          |     "bMaxPacketSize0" = 64
          |     "iProduct" = 2
          |     "iSerialNumber" = 0
          |     "bDeviceClass" = 9
          |     "Built-In" = No
          |     "locationID" = ${generateLocationId(337641472)}
          |     "bDeviceSubClass" = 0
          |     "bcdUSB" = 512
          |     "sessionID" = ${dynamicSessionId}
          |     "USBSpeed" = 2
          |     "idVendor" = 1678
          |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
          |     "Device Speed" = 2
          |     "bDeviceProtocol" = 1
          |     "PortNum" = 2
          |   }` : ""}
          |
          +-o HS03@14300000  <class IOUSBHostDevice, id ${generateDeviceId(4294968253)}, retain 12, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 2
          |   "idProduct" = 33076
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 2
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 64
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(338690048)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 512
          |   "bDeviceProtocol" = 1
          |   "PortNum" = 3
          | }
          |
          +-o HS04@14400000  <class IOUSBHostDevice, id ${generateDeviceId(4294968254)}, retain 12, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 2
          |   "idProduct" = 33076
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 2
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 64
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(339738624)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 512
          |   "bDeviceProtocol" = 1
          |   "PortNum" = 4
          | }
          |
          +-o HS05@14500000  <class IOUSBHostDevice, id ${generateDeviceId(4294968255)}, retain 17, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 2
          |   "idProduct" = 33076
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 2
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 64
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(340787200)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 512
          |   "bDeviceProtocol" = 1
          |   "PortNum" = 5
          | }${includeT2Controller ? `
          | +-o Apple T2 Controller@14500000  <class IOUSBHostDevice, id ${generateDeviceId(4294968258)}, retain 30, depth 6>
          |   {
          |     "iManufacturer" = 1
          |     "bNumConfigurations" = 1
          |     "idProduct" = 33025
          |     "bcdDevice" = 256
          |     "Bus Power Available" = 500
          |     "USB Address" = ${generateUsbAddress()}
          |     "bMaxPacketSize0" = 64
          |     "iProduct" = 2
          |     "iSerialNumber" = 3
          |     "bDeviceClass" = 0
          |     "Built-In" = Yes
          |     "locationID" = ${generateLocationId(340787200)}
          |     "bDeviceSubClass" = 0
          |     "bcdUSB" = 512
          |     "sessionID" = ${dynamicSessionId}
          |     "USBSpeed" = 2
          |     "idVendor" = 1452
          |     "USB Serial Number" = "${fakeSerial}"
          |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
          |     "Device Speed" = 2
          |     "bDeviceProtocol" = 0
          |     "PortNum" = 5
          |   }` : ""}
          |
          +-o SS01@14600000  <class IOUSBHostDevice, id ${generateDeviceId(4294968296)}, retain 12, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 4
          |   "idProduct" = 4126
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 3
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 9
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(341835776)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 768
          |   "bDeviceProtocol" = 3
          |   "PortNum" = 6
          | }
          |
          +-o SS02@14700000  <class IOUSBHostDevice, id ${generateDeviceId(4294968297)}, retain 15, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 4
          |   "idProduct" = 4126
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 3
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 9
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(342884352)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 768
          |   "bDeviceProtocol" = 3
          |   "PortNum" = 7
          | }${includeDellMonitor ? `
          | +-o Dell U3219Q @14700000  <class IOUSBHostDevice, id ${generateDeviceId(4294969428)}, retain 13, depth 6>
          |   {
          |     "iManufacturer" = 1
          |     "bNumConfigurations" = 1
          |     "idProduct" = 8747
          |     "bcdDevice" = 256
          |     "Bus Power Available" = 900
          |     "USB Address" = ${generateUsbAddress()}
          |     "bMaxPacketSize0" = 9
          |     "iProduct" = 2
          |     "iSerialNumber" = 0
          |     "bDeviceClass" = 9
          |     "Built-In" = No
          |     "locationID" = ${generateLocationId(342884352)}
          |     "bDeviceSubClass" = 0
          |     "bcdUSB" = 768
          |     "sessionID" = ${dynamicSessionId}
          |     "USBSpeed" = 4
          |     "idVendor" = 1678
          |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
          |     "Device Speed" = 3
          |     "bDeviceProtocol" = 1
          |     "PortNum" = 7
          |   }` : ""}
          |
          +-o SS03@14800000  <class IOUSBHostDevice, id ${generateDeviceId(4294968298)}, retain 15, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 4
          |   "idProduct" = 4126
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 3
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 9
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(343932928)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 768
          |   "bDeviceProtocol" = 3
          |   "PortNum" = 8
          | }${includeCalDigit ? `
          | +-o CalDigit TS3 Plus@14800000  <class IOUSBHostDevice, id ${generateDeviceId(4294969432)}, retain 15, depth 6>
          |   {
          |     "iManufacturer" = 1
          |     "bNumConfigurations" = 1
          |     "idProduct" = 22282
          |     "bcdDevice" = 1088
          |     "Bus Power Available" = 0
          |     "USB Address" = ${generateUsbAddress()}
          |     "bMaxPacketSize0" = 9
          |     "iProduct" = 2
          |     "iSerialNumber" = 3
          |     "bDeviceClass" = 9
          |     "Built-In" = No
          |     "locationID" = ${generateLocationId(343932928)}
          |     "bDeviceSubClass" = 0
          |     "bcdUSB" = 768
          |     "sessionID" = ${dynamicSessionId}
          |     "USBSpeed" = 4
          |     "idVendor" = 2109
          |     "USB Serial Number" = "000000000001"
          |     "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
          |     "Device Speed" = 3
          |     "bDeviceProtocol" = 1
          |     "PortNum" = 8
          |   }` : ""}
          |
          +-o SS04@14900000  <class IOUSBHostDevice, id ${generateDeviceId(4294968299)}, retain 12, depth 5>
          | {
          |   "sessionID" = ${dynamicSessionId}
          |   "USBSpeed" = 4
          |   "idProduct" = 4126
          |   "iManufacturer" = 0
          |   "bNumConfigurations" = 1
          |   "Device Speed" = 3
          |   "idVendor" = 32902
          |   "bcdDevice" = 0
          |   "Bus Power Available" = 0
          |   "bMaxPacketSize0" = 9
          |   "Built-In" = Yes
          |   "locationID" = ${generateLocationId(344981504)}
          |   "iProduct" = 0
          |   "bDeviceClass" = 9
          |   "iSerialNumber" = 0
          |   "bDeviceSubClass" = 0
          |   "bcdUSB" = 768
          |   "bDeviceProtocol" = 3
          |   "PortNum" = 9
          | }
          |
          +-o USR1@14a00000  <class IOUSBHostDevice, id ${generateDeviceId(4294968347)}, retain 15, depth 5>
            {
              "sessionID" = ${dynamicSessionId}
              "USBSpeed" = 2
              "idProduct" = 33076
              "iManufacturer" = 0
              "bNumConfigurations" = 1
              "Device Speed" = 2
              "idVendor" = 32902
              "bcdDevice" = 0
              "Bus Power Available" = 0
              "bMaxPacketSize0" = 64
              "Built-In" = Yes
              "locationID" = ${generateLocationId(346030080)}
              "iProduct" = 0
              "bDeviceClass" = 9
              "iSerialNumber" = 0
              "bDeviceSubClass" = 0
              "bcdUSB" = 512
              "bDeviceProtocol" = 1
              "PortNum" = 10
            }
            +-o Billboard Device@14a00000  <class IOUSBHostDevice, id ${generateDeviceId(4294969436)}, retain 13, depth 6>
            | {
            |   "iManufacturer" = 1
            |   "bNumConfigurations" = 1
            |   "idProduct" = 8194
            |   "bcdDevice" = 257
            |   "Bus Power Available" = 500
            |   "USB Address" = ${generateUsbAddress()}
            |   "bMaxPacketSize0" = 64
            |   "iProduct" = 2
            |   "iSerialNumber" = 0
            |   "bDeviceClass" = 17
            |   "Built-In" = No
            |   "locationID" = ${generateLocationId(346030080)}
            |   "bDeviceSubClass" = 0
            |   "bcdUSB" = 512
            |   "sessionID" = ${dynamicSessionId}
            |   "USBSpeed" = 2
            |   "idVendor" = 2109
            |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
            |   "Device Speed" = 2
            |   "bDeviceProtocol" = 0
            |   "PortNum" = 10
            | }
            |
            +-o USB2.0 Hub@14a10000  <class IOUSBHostDevice, id ${generateDeviceId(4294969443)}, retain 16, depth 6>
              {
                "iManufacturer" = 1
                "bNumConfigurations" = 1
                "idProduct" = 10785
                "bcdDevice" = 1088
                "Bus Power Available" = 500
                "USB Address" = ${generateUsbAddress()}
                "bMaxPacketSize0" = 64
                "iProduct" = 2
                "iSerialNumber" = 0
                "bDeviceClass" = 9
                "Built-In" = No
                "locationID" = ${generateLocationId(346095616)}
                "bDeviceSubClass" = 0
                "bcdUSB" = 512
                "sessionID" = ${dynamicSessionId}
                "USBSpeed" = 2
                "idVendor" = 2109
                "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
                "Device Speed" = 2
                "bDeviceProtocol" = 1
                "PortNum" = 1
              }${includeWebcam ? `
              +-o C922 Pro Stream Webcam@14a11000  <class IOUSBHostDevice, id ${generateDeviceId(4294969451)}, retain 20, depth 7>
              | {
              |   "iManufacturer" = 1
              |   "bNumConfigurations" = 1
              |   "idProduct" = 2093
              |   "bcdDevice" = 16
              |   "Bus Power Available" = 500
              |   "USB Address" = ${generateUsbAddress()}
              |   "bMaxPacketSize0" = 64
              |   "iProduct" = 2
              |   "iSerialNumber" = 3
              |   "bDeviceClass" = 239
              |   "Built-In" = No
              |   "locationID" = ${generateLocationId(346103808)}
              |   "bDeviceSubClass" = 2
              |   "bcdUSB" = 512
              |   "sessionID" = ${dynamicSessionId}
              |   "USBSpeed" = 2
              |   "idVendor" = 1133
              |   "USB Serial Number" = "A86D94AF"
              |   "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
              |   "Device Speed" = 2
              |   "bDeviceProtocol" = 1
              |   "PortNum" = 1
              | }
              | ` : ""}${includeUSBDrive ? `
              +-o Cruzer Blade@14a14000  <class IOUSBHostDevice, id ${generateDeviceId(4294969463)}, retain 15, depth 7>
                {
                  "iManufacturer" = 1
                  "bNumConfigurations" = 1
                  "idProduct" = 21845
                  "bcdDevice" = 256
                  "Bus Power Available" = 224
                  "USB Address" = ${generateUsbAddress()}
                  "bMaxPacketSize0" = 64
                  "iProduct" = 2
                  "iSerialNumber" = 3
                  "bDeviceClass" = 0
                  "Built-In" = No
                  "locationID" = ${generateLocationId(346120192)}
                  "bDeviceSubClass" = 0
                  "bcdUSB" = 512
                  "sessionID" = ${dynamicSessionId}
                  "USBSpeed" = 2
                  "idVendor" = 1921
                  "USB Serial Number" = "20053538421F86B191E5"
                  "IOPowerManagement" = {"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=4,"DriverPowerState"=2}
                  "Device Speed" = 2
                  "bDeviceProtocol" = 0
                  "PortNum" = 4
                }` : ""}`;
              }
            default:
              return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 4>
  +-o IOPlatformExpertDevice  <class IOPlatformExpertDevice, id 0x100000110, registered, matched, active, busy 0 (1 ms), retain 9>
    {
      "IOPlatformUUID" = "${fakeUUID}"
      "IOPlatformSerialNumber" = "${fakeSerial}"
      "board-id" = <"${fakeBoardId}">
      "model" = <"${fakeModel}">
      "serial-number" = <"${fakeSerial}">
    }`;
          }
        },
        /**
         * 伪造Windows注册表输出
         * @param {string} output - 原始注册表输出
         * @param {string} command - 执行的注册表命令（可选，用于生成特定格式的输出）
         * @returns {string} 伪造后的输出
         */
        spoofWindowsRegistryOutput(output, command = "") {
          log(`🎭 开始伪造Windows注册表输出...`);
          log(`📋 原始输出长度: ${output ? output.length : 0} 字符`);
          log(`🔍 命令上下文: ${command}`);
          if (!output || typeof output !== "string" || output.trim() === "") {
            log(`🔧 检测到空输出，生成逼真的注册表数据`);
            return this.generateRealisticRegistryOutput(command);
          }
          let spoofed = output;
          if (!INTERCEPTOR_CONFIG.system.winMachineGuid) {
            INTERCEPTOR_CONFIG.system.winMachineGuid = this.generateRandomGuid();
          }
          if (!INTERCEPTOR_CONFIG.system.winFeatureSet) {
            INTERCEPTOR_CONFIG.system.winFeatureSet = this.generateRandomFeatureSet();
          }
          const fakeMachineGuid = INTERCEPTOR_CONFIG.system.winMachineGuid;
          const fakeProductId = INTERCEPTOR_CONFIG.system.winProductId;
          const fakeSerial = INTERCEPTOR_CONFIG.system.winSerial;
          const fakeFeatureSet = INTERCEPTOR_CONFIG.system.winFeatureSet;
          const machineGuidPattern = /(MachineGuid\s+REG_SZ\s+)[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/g;
          const guidMatches = output.match(machineGuidPattern);
          if (guidMatches) {
            log(`🔍 发现${guidMatches.length}个MachineGuid，将替换为: ${fakeMachineGuid}`);
            spoofed = spoofed.replace(machineGuidPattern, `$1${fakeMachineGuid}`);
          }
          const featureSetPattern = /(FeatureSet\s+REG_DWORD\s+)0x[0-9A-Fa-f]{8}/g;
          const featureMatches = output.match(featureSetPattern);
          if (featureMatches) {
            log(`🔍 发现${featureMatches.length}个FeatureSet，将替换为: ${fakeFeatureSet}`);
            spoofed = spoofed.replace(featureSetPattern, `$1${fakeFeatureSet}`);
          }
          const productIdPattern = /(ProductId\s+REG_SZ\s+)[A-Z0-9\-]+/g;
          const productMatches = output.match(productIdPattern);
          if (productMatches) {
            log(`🔍 发现${productMatches.length}个ProductId，将替换为: ${fakeProductId}`);
            spoofed = spoofed.replace(productIdPattern, `$1${fakeProductId}`);
          }
          const serialNumberPattern = /(SerialNumber\s+REG_SZ\s+)[A-Z0-9]+/g;
          const serialMatches = output.match(serialNumberPattern);
          if (serialMatches) {
            log(`🔍 发现${serialMatches.length}个SerialNumber，将替换为: ${fakeSerial}`);
            spoofed = spoofed.replace(serialNumberPattern, `$1${fakeSerial}`);
          }
          log(`✅ Windows注册表输出伪造完成`);
          return spoofed;
        },
        /**
         * 生成完整的Windows注册表输出 - 完整版（从原始文件提取）
         * @param {string} command - 原始命令
         * @returns {string} 假的注册表输出
         */
        generateFakeWindowsRegistryOutput(command) {
          log(`🖥️ 生成Windows注册表输出，命令: ${command}`);
          const commandLower = command.toLowerCase();
          if (commandLower.includes("machineguid")) {
            return this.generateMachineGuidOutput();
          }
          if (commandLower.includes("productid")) {
            return this.generateProductIdOutput();
          }
          if (commandLower.includes("wmic")) {
            return this.generateWmicOutput(command);
          }
          if (commandLower.includes("systeminfo")) {
            return this.generateSystemInfoOutput();
          }
          log(`⚠️ 未识别的注册表查询类型，返回通用输出`);
          return this.generateGenericRegistryOutput();
        },
        /**
         * 生成MachineGuid查询的输出
         * @returns {string} MachineGuid注册表输出
         */
        generateMachineGuidOutput() {
          if (!INTERCEPTOR_CONFIG.system.winMachineGuid) {
            INTERCEPTOR_CONFIG.system.winMachineGuid = this.generateRandomGuid();
            log(`🔑 首次生成并缓存MachineGuid: ${INTERCEPTOR_CONFIG.system.winMachineGuid}`);
          }
          const fakeGuid = INTERCEPTOR_CONFIG.system.winMachineGuid;
          log(`🔑 使用缓存的MachineGuid输出: ${fakeGuid}`);
          return `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography
    MachineGuid    REG_SZ    ${fakeGuid}`;
        },
        /**
         * 生成ProductId查询的输出
         * @returns {string} ProductId注册表输出
         */
        generateProductIdOutput() {
          if (!INTERCEPTOR_CONFIG.system.winProductId) {
            INTERCEPTOR_CONFIG.system.winProductId = this.generateRandomProductId();
            log(`🔑 首次生成并缓存ProductId: ${INTERCEPTOR_CONFIG.system.winProductId}`);
          }
          const fakeProductId = INTERCEPTOR_CONFIG.system.winProductId;
          log(`🔑 使用缓存的ProductId输出: ${fakeProductId}`);
          return `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion
    ProductId    REG_SZ    ${fakeProductId}`;
        },
        /**
         * 生成通用注册表输出
         * @returns {string} 通用注册表输出
         */
        generateGenericRegistryOutput() {
          const fakeGuid = INTERCEPTOR_CONFIG.system.winGuid || this.generateRandomGuid();
          const fakeProductId = INTERCEPTOR_CONFIG.system.winProductId || this.generateRandomProductId();
          return `Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion]
"ProductId"="${fakeProductId}"
"InstallDate"=dword:5f8a1234
"RegisteredOwner"="User"
"RegisteredOrganization"=""

[HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography]
"MachineGuid"="${fakeGuid}"`;
        },
        /**
         * 生成随机GUID
         * @returns {string} 随机GUID
         */
        generateRandomGuid() {
          return [8, 4, 4, 4, 12].map(
            (len) => Array.from(
              { length: len },
              () => Math.floor(Math.random() * 16).toString(16)
            ).join("")
          ).join("-").toUpperCase();
        },
        /**
         * 生成随机ProductId
         * @returns {string} 随机ProductId
         */
        generateRandomProductId() {
          const part1 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
          const part2 = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("");
          const part3 = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
          const part4 = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join("");
          return `${part1}-${part2}-${part3}-${part4}`;
        },
        /**
         * 生成WMIC命令输出
         * @param {string} command - WMIC命令
         * @returns {string} WMIC输出
         */
        generateWmicOutput(command) {
          log(`🔧 生成WMIC输出，命令: ${command}`);
          const commandLower = command.toLowerCase();
          if (commandLower.includes("bios") && commandLower.includes("serialnumber")) {
            return this.generateWmicBiosSerialNumber();
          }
          if (commandLower.includes("networkadapter") && commandLower.includes("macaddress")) {
            return this.generateWmicNetworkMac();
          }
          if (commandLower.includes("computersystem")) {
            if (commandLower.includes("manufacturer")) {
              return this.generateWmicSystemManufacturer();
            } else if (commandLower.includes("model")) {
              return this.generateWmicSystemModel();
            } else {
              return this.generateWmicSystemInfo();
            }
          }
          log(`⚠️ 未识别的WMIC命令类型: ${command}`);
          return this.generateGenericWmicOutput();
        },
        /**
         * 生成WMIC BIOS序列号输出
         * @returns {string} BIOS序列号输出
         */
        generateWmicBiosSerialNumber() {
          if (!INTERCEPTOR_CONFIG.system.winBiosSerial) {
            INTERCEPTOR_CONFIG.system.winBiosSerial = this.generateRandomSerial();
            log(`🔧 首次生成并缓存BIOS序列号: ${INTERCEPTOR_CONFIG.system.winBiosSerial}`);
          }
          const fakeSerial = INTERCEPTOR_CONFIG.system.winBiosSerial;
          log(`🔧 使用缓存的BIOS序列号: ${fakeSerial}`);
          return `SerialNumber
${fakeSerial}`;
        },
        /**
         * 生成随机序列号
         * @returns {string} 随机序列号
         */
        generateRandomSerial() {
          const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
          return Array.from(
            { length: 10 },
            () => chars[Math.floor(Math.random() * chars.length)]
          ).join("");
        },
        /**
         * 生成WMIC网络MAC地址输出
         * @returns {string} MAC地址输出
         */
        generateWmicNetworkMac() {
          if (!INTERCEPTOR_CONFIG.system.winMacAddress) {
            INTERCEPTOR_CONFIG.system.winMacAddress = this.generateRandomMacAddress();
            log(`🔧 首次生成并缓存MAC地址: ${INTERCEPTOR_CONFIG.system.winMacAddress}`);
          }
          const fakeMac = INTERCEPTOR_CONFIG.system.winMacAddress;
          log(`🔧 使用缓存的MAC地址: ${fakeMac}`);
          return `MACAddress
${fakeMac}`;
        },
        /**
         * 生成随机MAC地址
         * @returns {string} 随机MAC地址
         */
        generateRandomMacAddress() {
          const firstByte = (Math.floor(Math.random() * 128) * 2 + 2).toString(16).padStart(2, "0").toUpperCase();
          const otherBytes = Array.from(
            { length: 5 },
            () => Math.floor(Math.random() * 256).toString(16).padStart(2, "0").toUpperCase()
          );
          return [firstByte, ...otherBytes].join(":");
        },
        /**
         * 生成WMIC系统制造商输出
         * @returns {string} 系统制造商输出
         */
        generateWmicSystemManufacturer() {
          if (INTERCEPTOR_CONFIG.system.winSystemManufacturer) {
            const manufacturer2 = INTERCEPTOR_CONFIG.system.winSystemManufacturer;
            log(`🔧 使用缓存的系统制造商: ${manufacturer2}`);
            return `Manufacturer
${manufacturer2}`;
          }
          const manufacturers = [
            "Dell Inc.",
            "HP",
            "Lenovo",
            "ASUS",
            "Acer",
            "MSI",
            "Apple Inc.",
            "Microsoft Corporation",
            "Samsung Electronics Co., Ltd."
          ];
          const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
          INTERCEPTOR_CONFIG.system.winSystemManufacturer = manufacturer;
          log(`🔧 首次生成并缓存系统制造商: ${manufacturer}`);
          return `Manufacturer
${manufacturer}`;
        },
        /**
         * 生成WMIC系统型号输出
         * @returns {string} 系统型号输出
         */
        generateWmicSystemModel() {
          if (INTERCEPTOR_CONFIG.system.winSystemModel) {
            const model2 = INTERCEPTOR_CONFIG.system.winSystemModel;
            log(`🔧 使用缓存的系统型号: ${model2}`);
            return `Model
${model2}`;
          }
          const models = [
            "OptiPlex 7090",
            "EliteDesk 800 G8",
            "ThinkCentre M720q",
            "PRIME B450M-A",
            "Aspire TC-895",
            "MAG B550 TOMAHAWK"
          ];
          const model = models[Math.floor(Math.random() * models.length)];
          INTERCEPTOR_CONFIG.system.winSystemModel = model;
          log(`🔧 首次生成并缓存系统型号: ${model}`);
          return `Model
${model}`;
        },
        /**
         * 生成WMIC系统信息输出
         * @returns {string} 系统信息输出
         */
        generateWmicSystemInfo() {
          const manufacturer = INTERCEPTOR_CONFIG.system.winSystemManufacturer || "Dell Inc.";
          const model = INTERCEPTOR_CONFIG.system.winSystemModel || "OptiPlex 7090";
          const uuid = INTERCEPTOR_CONFIG.system.winSystemUuid || this.generateRandomGuid().toUpperCase();
          return `Manufacturer  Model         UUID
${manufacturer}     ${model} {${uuid}}`;
        },
        /**
         * 生成通用WMIC输出
         * @returns {string} 通用WMIC输出
         */
        generateGenericWmicOutput() {
          log(`📝 生成通用WMIC输出`);
          return `查询操作已完成。`;
        },
        /**
         * 生成systeminfo命令输出
         * @returns {string} systeminfo输出
         */
        generateSystemInfoOutput() {
          log(`🖥️ 生成systeminfo输出`);
          if (!INTERCEPTOR_CONFIG.system.winSystemInfoData) {
            INTERCEPTOR_CONFIG.system.winSystemInfoData = this.generateSystemInfoData();
            log(`🔧 首次生成并缓存systeminfo数据`);
          }
          const data = INTERCEPTOR_CONFIG.system.winSystemInfoData;
          log(`🔧 使用缓存的systeminfo数据`);
          return this.formatSystemInfoOutput(data);
        },
        /**
         * 生成systeminfo数据
         * @returns {Object} systeminfo数据对象
         */
        generateSystemInfoData() {
          let hostName = INTERCEPTOR_CONFIG.system.hostname;
          if (hostName && hostName.includes("-") && !hostName.toUpperCase().startsWith("DESKTOP-")) {
            hostName = "DESKTOP-" + hostName.replace(/[^A-Z0-9]/gi, "").toUpperCase().substring(0, 6);
            log(`🔧 将hostname从Unix风格转换为Windows风格: ${INTERCEPTOR_CONFIG.system.hostname} -> ${hostName}`);
          } else if (!hostName) {
            hostName = this.generateRandomHostName();
            log(`🔧 生成新的Windows风格hostname: ${hostName}`);
          }
          const osVersions = [
            { name: "Microsoft Windows 11 Pro", version: "10.0.26100 N/A Build 26100" },
            { name: "Microsoft Windows 11 Home", version: "10.0.26100 N/A Build 26100" },
            { name: "Microsoft Windows 10 Pro", version: "10.0.19045 N/A Build 19045" },
            { name: "Microsoft Windows 10 Home", version: "10.0.19045 N/A Build 19045" }
          ];
          const osInfo = osVersions[Math.floor(Math.random() * osVersions.length)];
          let manufacturer, model;
          if (INTERCEPTOR_CONFIG.system.winSystemManufacturer && INTERCEPTOR_CONFIG.system.winSystemModel) {
            manufacturer = INTERCEPTOR_CONFIG.system.winSystemManufacturer;
            model = INTERCEPTOR_CONFIG.system.winSystemModel;
          } else {
            const manufacturers = ["Dell Inc.", "HP", "Lenovo", "ASUS"];
            manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
            model = this.getSystemModelsForManufacturer(manufacturer)[0];
            INTERCEPTOR_CONFIG.system.winSystemManufacturer = manufacturer;
            INTERCEPTOR_CONFIG.system.winSystemModel = model;
            log(`🔧 首次生成并缓存系统制造商: ${manufacturer}, 型号: ${model}`);
          }
          const memoryConfigs = [
            { total: 8192, available: 5120 },
            // 8GB
            { total: 16384, available: 10240 },
            // 16GB
            { total: 32768, available: 20480 }
            // 32GB
          ];
          const memory = memoryConfigs[Math.floor(Math.random() * memoryConfigs.length)];
          return {
            hostName,
            osName: osInfo.name,
            osVersion: osInfo.version,
            manufacturer,
            model,
            memory,
            productId: INTERCEPTOR_CONFIG.system.winProductId || this.generateRandomProductId(),
            installDate: this.generateRandomInstallDate(),
            bootTime: this.generateRandomBootTime(),
            processor: this.getProcessorInfoForSystemInfo()[0],
            biosVersion: this.getBiosVersionsForManufacturer(manufacturer)[0]
          };
        },
        /**
         * 获取制造商对应的系统型号
         * @param {string} manufacturer - 制造商
         * @returns {Array} 型号数组
         */
        getSystemModelsForManufacturer(manufacturer) {
          const modelMap = {
            "Dell Inc.": ["OptiPlex 7090", "OptiPlex 5090", "Vostro 3681"],
            "HP": ["EliteDesk 800 G8", "ProDesk 400 G7", "Pavilion Desktop"],
            "Lenovo": ["ThinkCentre M720q", "IdeaCentre 5", "Legion Tower 5i"],
            "ASUS": ["PRIME B450M-A", "ROG Strix B550-F", "TUF Gaming B450M"]
          };
          return modelMap[manufacturer] || ["Desktop", "Computer", "PC"];
        },
        /**
         * 获取处理器信息 (systeminfo格式)
         * @returns {Array} 处理器信息数组
         */
        getProcessorInfoForSystemInfo() {
          return [
            "Intel64 Family 6 Model 183 Stepping 1 GenuineIntel ~2200 Mhz",
            "Intel64 Family 6 Model 165 Stepping 2 GenuineIntel ~2900 Mhz",
            "AMD64 Family 25 Model 33 Stepping 0 AuthenticAMD ~3600 Mhz"
          ];
        },
        /**
         * 根据制造商获取BIOS版本
         * @param {string} manufacturer - 制造商
         * @returns {Array} BIOS版本数组
         */
        getBiosVersionsForManufacturer(manufacturer) {
          const biosMap = {
            "Dell Inc.": ["Dell Inc. 2.18.0, 12/15/2023", "Dell Inc. 2.17.0, 11/20/2023"],
            "HP": ["HP F.49, 10/25/2023", "HP F.48, 09/15/2023"],
            "Lenovo": ["Lenovo M1AKT59A, 11/30/2023", "Lenovo M1AKT58A, 10/20/2023"],
            "ASUS": ["American Megatrends Inc. 4021, 12/01/2023", "American Megatrends Inc. 4020, 11/01/2023"]
          };
          return biosMap[manufacturer] || ["BIOS Version 1.0, 01/01/2023"];
        },
        /**
         * 生成随机主机名
         * @returns {string} 随机主机名
         */
        generateRandomHostName() {
          const prefixes = ["DESKTOP", "PC", "WORKSTATION", "COMPUTER", "WIN"];
          const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
          const suffix = Array.from(
            { length: 6 },
            () => Math.floor(Math.random() * 36).toString(36).toUpperCase()
          ).join("");
          return `${prefix}-${suffix}`;
        },
        /**
         * 生成随机安装日期
         * @returns {string} 随机安装日期
         */
        generateRandomInstallDate() {
          const year = 2023 + Math.floor(Math.random() * 2);
          const month = Math.floor(Math.random() * 12) + 1;
          const day = Math.floor(Math.random() * 28) + 1;
          return `${month}/${day}/${year}, 10:30:00 AM`;
        },
        /**
         * 生成随机启动时间
         * @returns {string} 随机启动时间
         */
        generateRandomBootTime() {
          const now = /* @__PURE__ */ new Date();
          const hoursAgo = Math.floor(Math.random() * 24) + 1;
          const bootTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1e3);
          const month = bootTime.getMonth() + 1;
          const day = bootTime.getDate();
          const year = bootTime.getFullYear();
          const hour = bootTime.getHours();
          const minute = bootTime.getMinutes();
          const second = bootTime.getSeconds();
          return `${month}/${day}/${year}, ${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
        },
        /**
         * 格式化systeminfo输出
         * @param {Object} data - 系统信息数据
         * @returns {string} 格式化的systeminfo输出
         */
        formatSystemInfoOutput(data) {
          const virtualMemoryMax = Math.floor(data.memory.total * 1.1);
          const virtualMemoryAvailable = Math.floor(data.memory.available * 1.1);
          const virtualMemoryInUse = virtualMemoryMax - virtualMemoryAvailable;
          const networkCards = this.generateNetworkCardsInfo();
          const hotfixes = this.generateHotfixesInfo();
          return `
Host Name:                     ${data.hostName}
OS Name:                       ${data.osName}
OS Version:                    ${data.osVersion}
OS Manufacturer:               Microsoft Corporation
OS Configuration:              Standalone Workstation
OS Build Type:                 Multiprocessor Free
Registered Owner:              ${data.hostName}@${data.hostName.toLowerCase()}.com
Registered Organization:       N/A
Product ID:                    ${data.productId}
Original Install Date:         ${data.installDate}
System Boot Time:              ${data.bootTime}
System Manufacturer:           ${data.manufacturer}
System Model:                  ${data.model}
System Type:                   x64-based PC
Processor(s):                  1 Processor(s) Installed.
                               [01]: ${data.processor}
BIOS Version:                  ${data.biosVersion}
Windows Directory:             C:\\WINDOWS
System Directory:              C:\\WINDOWS\\system32
Boot Device:                   \\Device\\HarddiskVolume1
System Locale:                 en-us;English (United States)
Input Locale:                  en-us;English (United States)
Time Zone:                     (UTC-08:00) Pacific Time (US & Canada)
Total Physical Memory:         ${data.memory.total.toLocaleString()} MB
Available Physical Memory:     ${data.memory.available.toLocaleString()} MB
Virtual Memory: Max Size:      ${virtualMemoryMax.toLocaleString()} MB
Virtual Memory: Available:     ${virtualMemoryAvailable.toLocaleString()} MB
Virtual Memory: In Use:        ${virtualMemoryInUse.toLocaleString()} MB
Page File Location(s):         C:\\pagefile.sys
Domain:                        WORKGROUP
Logon Server:                  \\\\${data.hostName}
${hotfixes}
${networkCards}
Virtualization-based security: Status: Not enabled
                               App Control for Business policy: Audit
                               App Control for Business user mode policy: Off
                               Security Features Enabled:
Hyper-V Requirements:          VM Monitor Mode Extensions: Yes
                               Virtualization Enabled In Firmware: Yes
                               Second Level Address Translation: Yes
                               Data Execution Prevention Available: Yes
`.trim();
        },
        /**
         * 生成网卡信息
         * @returns {string} 网卡信息
         */
        generateNetworkCardsInfo() {
          const networkConfigs = [
            {
              count: 3,
              cards: [
                {
                  name: "Intel(R) Wi-Fi 6E AX211 160MHz",
                  connection: "Internet",
                  dhcp: true,
                  dhcpServer: "192.168.1.1",
                  ips: ["192.168.1.100", "fe80::1234:5678:9abc:def0"]
                },
                {
                  name: "Realtek PCIe GbE Family Controller",
                  connection: "Ethernet",
                  dhcp: false,
                  ips: ["192.168.0.100", "fe80::abcd:ef12:3456:7890"]
                },
                {
                  name: "Bluetooth Device (Personal Area Network)",
                  connection: "Bluetooth Network Connection",
                  status: "Media disconnected"
                }
              ]
            },
            {
              count: 4,
              cards: [
                {
                  name: "Intel(R) Ethernet Connection I219-V",
                  connection: "Ethernet",
                  dhcp: true,
                  dhcpServer: "10.0.0.1",
                  ips: ["10.0.0.50", "fe80::2468:ace0:1357:9bdf"]
                },
                {
                  name: "Intel(R) Wi-Fi 6 AX200 160MHz",
                  connection: "Wi-Fi",
                  dhcp: true,
                  dhcpServer: "192.168.1.1",
                  ips: ["192.168.1.150", "fe80::9876:5432:10ab:cdef"]
                },
                {
                  name: "VMware Virtual Ethernet Adapter for VMnet1",
                  connection: "VMware Network Adapter VMnet1",
                  dhcp: false,
                  ips: ["192.168.192.1", "fe80::3b21:3ecb:808e:67b8"]
                },
                {
                  name: "Bluetooth Device (Personal Area Network)",
                  connection: "Bluetooth Network Connection",
                  status: "Media disconnected"
                }
              ]
            }
          ];
          const config = networkConfigs[Math.floor(Math.random() * networkConfigs.length)];
          let output = `Network Card(s):               ${config.count} NIC(s) Installed.
`;
          config.cards.forEach((card, index) => {
            const cardNum = (index + 1).toString().padStart(2, "0");
            output += `                               [${cardNum}]: ${card.name}
`;
            output += `                                     Connection Name: ${card.connection}
`;
            if (card.status) {
              output += `                                     Status:          ${card.status}
`;
            } else {
              if (card.dhcp !== void 0) {
                output += `                                     DHCP Enabled:    ${card.dhcp ? "Yes" : "No"}
`;
              }
              if (card.dhcpServer) {
                output += `                                     DHCP Server:     ${card.dhcpServer}
`;
              }
              if (card.ips && card.ips.length > 0) {
                output += `                                     IP address(es)
`;
                card.ips.forEach((ip, ipIndex) => {
                  const ipNum = (ipIndex + 1).toString().padStart(2, "0");
                  output += `                                     [${ipNum}]: ${ip}
`;
                });
              }
            }
          });
          return output.trim();
        },
        /**
         * 生成热修复信息
         * @returns {string} 热修复信息
         */
        generateHotfixesInfo() {
          const hotfixSets = [
            ["KB5056579", "KB5062660", "KB5063666", "KB5064485"],
            ["KB5055999", "KB5061001", "KB5062562", "KB5063228"],
            ["KB5057144", "KB5060414", "KB5061566", "KB5063950"],
            ["KB5058204", "KB5061317", "KB5062746", "KB5064718"]
          ];
          const hotfixes = hotfixSets[Math.floor(Math.random() * hotfixSets.length)];
          let output = `Hotfix(s):                     ${hotfixes.length} Hotfix(s) Installed.
`;
          hotfixes.forEach((hotfix, index) => {
            const hotfixNum = (index + 1).toString().padStart(2, "0");
            output += `                               [${hotfixNum}]: ${hotfix}
`;
          });
          return output.trim();
        }
      };
    }
  });

  // src/interceptors/event-reporter.js
  var PreciseEventReporterInterceptor;
  var init_event_reporter = __esm({
    "src/interceptors/event-reporter.js"() {
      init_config();
      init_logger();
      PreciseEventReporterInterceptor = {
        // 拦截统计
        interceptionStats: {
          totalInterceptions: 0,
          byReporter: {},
          byMethod: {},
          lastInterception: null
        },
        /**
         * 记录拦截统计
         * @param {string} reporterType - 报告器类型
         * @param {string} method - 方法名
         */
        recordInterception(reporterType, method) {
          this.interceptionStats.totalInterceptions++;
          this.interceptionStats.byReporter[reporterType] = (this.interceptionStats.byReporter[reporterType] || 0) + 1;
          this.interceptionStats.byMethod[method] = (this.interceptionStats.byMethod[method] || 0) + 1;
          this.interceptionStats.lastInterception = {
            reporterType,
            method,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          };
        },
        /**
         * 获取拦截统计
         * @returns {Object} 拦截统计信息
         */
        getInterceptionStats() {
          return {
            ...this.interceptionStats,
            topReporters: Object.entries(this.interceptionStats.byReporter).sort(([, a], [, b]) => b - a).slice(0, 5),
            topMethods: Object.entries(this.interceptionStats.byMethod).sort(([, a], [, b]) => b - a).slice(0, 5)
          };
        },
        /**
         * 重置拦截统计
         */
        resetInterceptionStats() {
          this.interceptionStats = {
            totalInterceptions: 0,
            byReporter: {},
            byMethod: {},
            lastInterception: null
          };
          log("🔄 Event Reporter拦截统计已重置");
        },
        /**
         * 初始化精确的Event Reporter拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enablePreciseEventReporterControl) {
            return;
          }
          log("🎯 初始化精确Event Reporter拦截...");
          this.interceptGlobalReporters();
          this.interceptModuleExports();
          log("✅ 精确Event Reporter拦截设置完成");
        },
        /**
         * 拦截全局对象上的Event Reporter
         */
        interceptGlobalReporters() {
          EVENT_REPORTER_TYPES.forEach((reporterType) => {
            this.interceptReporterType(reporterType);
          });
        },
        /**
         * 拦截特定类型的Reporter
         * @param {string} reporterType - Reporter类型名称
         */
        interceptReporterType(reporterType) {
          const globalObjects = [];
          if (typeof global !== "undefined")
            globalObjects.push(global);
          if (typeof window !== "undefined")
            globalObjects.push(window);
          if (typeof self !== "undefined")
            globalObjects.push(self);
          globalObjects.forEach((globalObj) => {
            if (globalObj && globalObj[reporterType]) {
              this.interceptReporterInstance(globalObj[reporterType], reporterType);
            }
          });
        },
        /**
         * 拦截Reporter实例的enableUpload方法
         * @param {Object} reporter - Reporter实例
         * @param {string} reporterType - Reporter类型
         */
        interceptReporterInstance(reporter, reporterType) {
          if (!reporter || typeof reporter !== "object")
            return;
          if (typeof reporter.enableUpload === "function") {
            const originalEnableUpload = reporter.enableUpload;
            reporter.enableUpload = function(...args) {
              log(`🎭 拦截 ${reporterType}.enableUpload() 调用`);
              const interceptInfo = {
                reporterType,
                method: "enableUpload",
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                args: args.length > 0 ? `${args.length} 个参数` : "无参数",
                action: "拦截"
              };
              console.log("\n📊 Event Reporter 拦截详情:");
              console.log(`  🎯 Reporter类型: ${interceptInfo.reporterType}`);
              console.log(`  🔧 调用方法: ${interceptInfo.method}()`);
              console.log(`  ⏰ 拦截时间: ${interceptInfo.timestamp}`);
              console.log(`  📋 参数信息: ${interceptInfo.args}`);
              console.log(`  🚫 执行动作: ${interceptInfo.action}`);
              if (args.length > 0) {
                try {
                  args.forEach((arg, index) => {
                    if (arg !== null && arg !== void 0) {
                      const argType = typeof arg;
                      const argPreview = argType === "object" ? `[${argType}] ${Object.keys(arg).length} 个属性` : `[${argType}] ${String(arg).substring(0, 50)}${String(arg).length > 50 ? "..." : ""}`;
                      console.log(`    参数 ${index + 1}: ${argPreview}`);
                    }
                  });
                } catch (e) {
                  console.log(`    参数解析失败: ${e.message}`);
                }
              }
              PreciseEventReporterInterceptor.recordInterception(reporterType, "enableUpload");
              return Promise.resolve({
                success: true,
                intercepted: true,
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                message: "Event upload intercepted by AugmentCode"
              });
            };
            log(`✅ 已拦截 ${reporterType}.enableUpload() 方法`);
          }
        },
        /**
         * 拦截可能的模块导出
         */
        interceptModuleExports() {
          if (typeof __require !== "undefined") {
            const originalRequire = __require;
            __require = function(moduleName) {
              const module = originalRequire.apply(this, arguments);
              if (module && typeof module === "object") {
                EVENT_REPORTER_TYPES.forEach((reporterType) => {
                  if (module[reporterType] && typeof module[reporterType] === "object") {
                    log(`🎯 检测到模块中的Event Reporter: ${moduleName}.${reporterType}`);
                    PreciseEventReporterInterceptor.interceptReporterInstance(module[reporterType], reporterType);
                  }
                });
              }
              return module;
            };
            Object.setPrototypeOf(__require, originalRequire);
            Object.getOwnPropertyNames(originalRequire).forEach((prop) => {
              if (prop !== "length" && prop !== "name") {
                __require[prop] = originalRequire[prop];
              }
            });
          }
        }
      };
    }
  });

  // src/interceptors/analytics.js
  var SafeAnalyticsInterceptor;
  var init_analytics = __esm({
    "src/interceptors/analytics.js"() {
      init_config();
      init_logger();
      SafeAnalyticsInterceptor = {
        /**
         * 初始化安全的Analytics拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enableAnalyticsBlocking) {
            return;
          }
          log("🛡️ 初始化安全Analytics拦截...");
          this.interceptWindowAnalytics();
          this.interceptSegmentAnalytics();
          log("✅ 安全Analytics拦截设置完成");
        },
        /**
         * 拦截window.Analytics对象
         */
        interceptWindowAnalytics() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          if (globalObj.Analytics && typeof globalObj.Analytics === "object") {
            log("🎯 检测到window.Analytics对象，创建安全代理...");
            globalObj.Analytics = this.createAnalyticsProxy(globalObj.Analytics);
          }
          let analyticsCheckCount = 0;
          const checkInterval = setInterval(() => {
            analyticsCheckCount++;
            if (globalObj.Analytics && typeof globalObj.Analytics === "object" && !globalObj.Analytics._augmentProxied) {
              log("🎯 检测到新的window.Analytics对象，创建安全代理...");
              globalObj.Analytics = this.createAnalyticsProxy(globalObj.Analytics);
            }
            if (analyticsCheckCount >= 30) {
              clearInterval(checkInterval);
              log("⏰ Analytics对象检查定时器已停止");
            }
          }, 1e3);
        },
        /**
         * 创建Analytics代理对象
         * @param {Object} originalAnalytics - 原始Analytics对象
         * @returns {Proxy} Analytics代理对象
         */
        createAnalyticsProxy(originalAnalytics) {
          if (originalAnalytics._augmentProxied) {
            return originalAnalytics;
          }
          const proxy = new Proxy(originalAnalytics, {
            get: function(target, prop, receiver) {
              if (prop === "track") {
                return function(event, properties, options, callback) {
                  log(`🚫 拦截Analytics.track调用: ${event}`);
                  if (typeof callback === "function") {
                    setTimeout(() => callback(null, { success: true }), 0);
                  }
                  return Promise.resolve({ success: true, intercepted: true });
                };
              }
              if (prop === "identify") {
                return function(userId, traits, options, callback) {
                  log(`🚫 拦截Analytics.identify调用: ${userId}`);
                  if (typeof callback === "function") {
                    setTimeout(() => callback(null, { success: true }), 0);
                  }
                  return Promise.resolve({ success: true, intercepted: true });
                };
              }
              if (prop === "page") {
                return function(category, name, properties, options, callback) {
                  log(`🚫 拦截Analytics.page调用: ${name || category}`);
                  if (typeof callback === "function") {
                    setTimeout(() => callback(null, { success: true }), 0);
                  }
                  return Promise.resolve({ success: true, intercepted: true });
                };
              }
              if (prop === "group") {
                return function(groupId, traits, options, callback) {
                  log(`🚫 拦截Analytics.group调用: ${groupId}`);
                  if (typeof callback === "function") {
                    setTimeout(() => callback(null, { success: true }), 0);
                  }
                  return Promise.resolve({ success: true, intercepted: true });
                };
              }
              if (prop === "alias") {
                return function(userId, previousId, options, callback) {
                  log(`🚫 拦截Analytics.alias调用: ${userId} -> ${previousId}`);
                  if (typeof callback === "function") {
                    setTimeout(() => callback(null, { success: true }), 0);
                  }
                  return Promise.resolve({ success: true, intercepted: true });
                };
              }
              return Reflect.get(target, prop, receiver);
            }
          });
          Object.defineProperty(proxy, "_augmentProxied", {
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
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          if (globalObj.analytics && typeof globalObj.analytics === "object") {
            log("🎯 检测到Segment analytics对象，创建安全代理...");
            globalObj.analytics = this.createAnalyticsProxy(globalObj.analytics);
          }
          Object.defineProperty(globalObj, "analytics", {
            get: function() {
              return this._analytics;
            },
            set: function(value) {
              if (value && typeof value === "object" && !value._augmentProxied) {
                log("🎯 检测到新的analytics对象，创建安全代理...");
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
    }
  });

  // src/interceptors/api-server-error.js
  var ApiServerErrorReportInterceptor;
  var init_api_server_error = __esm({
    "src/interceptors/api-server-error.js"() {
      init_config();
      init_logger();
      ApiServerErrorReportInterceptor = {
        /**
         * 初始化API服务器错误报告拦截
         */
        initialize() {
          if (!INTERCEPTOR_CONFIG.dataProtection.enableApiServerErrorReportInterception) {
            return;
          }
          log("🚫 初始化API服务器错误报告拦截...");
          this.interceptApiServerInstances();
          this.interceptApiServerConstructors();
          log("✅ API服务器错误报告拦截设置完成");
        },
        /**
         * 拦截现有的API服务器实例
         */
        interceptApiServerInstances() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          const commonApiServerNames = [
            "_apiServer",
            "apiServer",
            "server",
            "httpServer",
            "expressServer",
            "app",
            "application"
          ];
          commonApiServerNames.forEach((name) => {
            if (globalObj[name] && typeof globalObj[name] === "object") {
              if (typeof globalObj[name].reportError === "function") {
                this.interceptReportErrorMethod(globalObj[name], name);
              }
            }
          });
          let checkCount = 0;
          const checkInterval = setInterval(() => {
            checkCount++;
            commonApiServerNames.forEach((name) => {
              if (globalObj[name] && typeof globalObj[name] === "object") {
                if (typeof globalObj[name].reportError === "function" && !globalObj[name]._augmentErrorReportIntercepted) {
                  this.interceptReportErrorMethod(globalObj[name], name);
                }
              }
            });
            if (checkCount >= 30) {
              clearInterval(checkInterval);
              log("⏰ API服务器实例检查定时器已停止");
            }
          }, 1e3);
        },
        /**
         * 拦截API服务器构造函数
         */
        interceptApiServerConstructors() {
          const globalObj = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : this;
          const constructorNames = ["ApiServer", "Server", "HttpServer", "ExpressServer"];
          constructorNames.forEach((name) => {
            if (typeof globalObj[name] === "function") {
              this.interceptConstructor(globalObj, name);
            }
          });
        },
        /**
         * 拦截构造函数
         * @param {Object} globalObj - 全局对象
         * @param {string} name - 构造函数名称
         */
        interceptConstructor(globalObj, name) {
          const originalConstructor = globalObj[name];
          globalObj[name] = function(...args) {
            const instance = new originalConstructor(...args);
            if (typeof instance.reportError === "function") {
              ApiServerErrorReportInterceptor.interceptReportErrorMethod(instance, `${name} instance`);
            }
            return instance;
          };
          Object.setPrototypeOf(globalObj[name], originalConstructor);
          Object.getOwnPropertyNames(originalConstructor).forEach((prop) => {
            if (prop !== "length" && prop !== "name" && prop !== "prototype") {
              globalObj[name][prop] = originalConstructor[prop];
            }
          });
        },
        /**
         * 拦截reportError方法
         * @param {Object} apiServer - API服务器实例
         * @param {string} instanceName - 实例名称
         */
        interceptReportErrorMethod(apiServer, instanceName) {
          const originalReportError = apiServer.reportError;
          apiServer.reportError = function(message, stackTrace, requestId, ...args) {
            const sanitizedMessage = typeof message === "string" ? message.substring(0, 200) : String(message).substring(0, 200);
            const originalRequestId = requestId || "unknown";
            log(`🚫 拦截API服务器错误报告: ${instanceName}`);
            log(`   错误类型: ${sanitizedMessage}`);
            log(`   请求ID: ${originalRequestId}`);
            if (ApiServerErrorReportInterceptor.isCodeIndexingRelatedError(sanitizedMessage, stackTrace)) {
              log(`✅ 允许代码索引相关的错误报告: ${sanitizedMessage}`);
              return originalReportError.apply(this, arguments);
            }
            log(`🚫 阻止遥测相关的错误报告: ${sanitizedMessage}`);
            return Promise.resolve();
          };
          apiServer._augmentErrorReportIntercepted = true;
          log(`🎯 已拦截 ${instanceName} 的 reportError 方法`);
        },
        /**
         * 判断错误是否与代码索引相关
         * @param {string} message - 错误消息
         * @param {string} stackTrace - 堆栈跟踪
         * @returns {boolean} 是否与代码索引相关
         */
        isCodeIndexingRelatedError(message, stackTrace) {
          if (!message && !stackTrace)
            return false;
          const combinedText = `${message || ""} ${stackTrace || ""}`.toLowerCase();
          const isCodeIndexingRelated = CODE_INDEXING_PATTERNS.some(
            (pattern) => combinedText.includes(pattern.toLowerCase())
          );
          if (isCodeIndexingRelated) {
            log(`✅ 检测到代码索引相关错误`);
            return true;
          }
          const importantFeatureKeywords = [
            "completion",
            "chat",
            "memorize",
            "retrieval",
            "upload",
            "workspace",
            "symbol",
            "index",
            "blob",
            "codebase",
            "augment-api",
            "augment-backend",
            "agents"
          ];
          const isImportantFeature = importantFeatureKeywords.some(
            (keyword) => combinedText.includes(keyword)
          );
          if (isImportantFeature) {
            log(`✅ 检测到重要功能相关错误`);
            return true;
          }
          const telemetryKeywords = [
            "telemetry",
            "analytics",
            "tracking",
            "metrics",
            "stats",
            "event",
            "report",
            "segment",
            "collect",
            "gather"
          ];
          const isTelemetryRelated = telemetryKeywords.some(
            (keyword) => combinedText.includes(keyword)
          );
          if (isTelemetryRelated) {
            log(`🚫 检测到遥测相关错误`);
            return false;
          }
          log(`⚪ 未知错误类型，采用保守策略允许报告`);
          return true;
        }
      };
    }
  });

  // src/interceptors/json.js
  var init_json = __esm({
    "src/interceptors/json.js"() {
      init_config();
      init_logger();
      init_classifier();
    }
  });

  // src/index.js
  var require_src = __commonJS({
    "src/index.js"(exports, module) {
      init_config();
      init_logger();
      init_system_info_generator();
      init_url_classifier();
      init_session_manager();
      init_classifier();
      init_identity_manager();
      init_network();
      init_vscode();
      init_system_api();
      init_system_command();
      init_event_reporter();
      init_analytics();
      init_api_server_error();
      init_json();
      (function() {
        "use strict";
        const MainInitializer = {
          /**
           * 初始化所有拦截器模块
           */
          initializeAll() {
            log("🚀 开始初始化 v2.5 精确拦截器...");
            try {
              this.initializeSystemInfo();
              log("📊 智能数据分类器已就绪");
              PreciseEventReporterInterceptor.initialize();
              ApiServerErrorReportInterceptor.initialize();
              SafeAnalyticsInterceptor.initialize();
              SystemApiInterceptor.initialize();
              SystemCommandInterceptor.initialize();
              VSCodeInterceptor.initialize();
              NetworkInterceptor.initializeAll();
              this.setupGlobalInterface();
              log("✅ v2.5 精确拦截器初始化完成！");
              this.printStatus();
            } catch (error) {
              log(`❌ 初始化失败: ${error.message}`, "error");
              console.error("[AugmentCode拦截器] 初始化错误详情:", error);
            }
          },
          /**
           * 初始化系统信息
           */
          initializeSystemInfo() {
            const fakeSystemInfo = SystemInfoGenerator.generateFakeSystemInfo();
            INTERCEPTOR_CONFIG.system = fakeSystemInfo;
            log("🖥️ 系统信息初始化完成");
            log(`   平台: ${fakeSystemInfo.platform}/${fakeSystemInfo.arch}`);
            log(`   主机名: ${fakeSystemInfo.hostname}`);
            log(`   VSCode版本: ${fakeSystemInfo.vscodeVersion}`);
            if (fakeSystemInfo.platform === "darwin") {
              log(`   Mac序列号: ${fakeSystemInfo.macSerial}`);
              log(`   Mac型号: ${fakeSystemInfo.macModel}`);
            } else if (fakeSystemInfo.platform === "win32") {
              log(`   Windows产品ID: ${fakeSystemInfo.winProductId}`);
            }
          },
          /**
           * 设置全局配置接口
           */
          setupGlobalInterface() {
            let globalObj = this;
            if (typeof global !== "undefined") {
              globalObj = global;
            } else if (typeof window !== "undefined") {
              globalObj = window;
            }
            globalObj.AugmentCodeInterceptor = {
              version: INTERCEPTOR_CONFIG.version,
              config: INTERCEPTOR_CONFIG,
              // 配置方法
              enableDebug: () => {
                INTERCEPTOR_CONFIG.debugMode = true;
                log("🔧 调试模式已启用");
              },
              disableDebug: () => {
                INTERCEPTOR_CONFIG.debugMode = false;
                console.log("[AugmentCode拦截器] 🔧 调试模式已禁用");
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
                log("📊 系统信息访问统计:");
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
                log("🔄 已重置系统信息访问统计");
              },
              // VSCode环境变量访问统计
              getVSCodeEnvAccessStats: () => {
                const stats = INTERCEPTOR_CONFIG.vscodeEnvAccessCount;
                const total = Object.values(stats).reduce((sum, count) => sum + count, 0);
                log("📊 VSCode环境变量访问统计:");
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
                log("🔄 已重置VSCode环境变量访问统计");
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
                  const globalObj2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
                  return globalObj2._augmentVSCodeVersionConfig ? globalObj2._augmentVSCodeVersionConfig.getStatus() : null;
                },
                setFixedVersion: (version) => {
                  const globalObj2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
                  return globalObj2._augmentVSCodeVersionConfig ? globalObj2._augmentVSCodeVersionConfig.setFixedVersion(version) : false;
                },
                clearFixedVersion: () => {
                  const globalObj2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
                  if (globalObj2._augmentVSCodeVersionConfig) {
                    globalObj2._augmentVSCodeVersionConfig.clearFixedVersion();
                  }
                },
                addVersion: (version) => {
                  const globalObj2 = typeof global !== "undefined" ? global : typeof window !== "undefined" ? window : {};
                  return globalObj2._augmentVSCodeVersionConfig ? globalObj2._augmentVSCodeVersionConfig.addVersion(version) : false;
                }
              },
              // 打印拦截统计报告
              printInterceptionReport: () => {
                const stats = PreciseEventReporterInterceptor.getInterceptionStats();
                console.log("\n📊 Event Reporter 拦截统计报告");
                console.log("=".repeat(50));
                console.log(`总拦截次数: ${stats.totalInterceptions}`);
                if (stats.lastInterception) {
                  console.log(`最后拦截: ${stats.lastInterception.reporterType}.${stats.lastInterception.method}()`);
                  console.log(`拦截时间: ${stats.lastInterception.timestamp}`);
                }
                if (stats.topReporters && stats.topReporters.length > 0) {
                  console.log("\n🎯 拦截最多的Reporter:");
                  stats.topReporters.forEach(([reporter, count], index) => {
                    console.log(`  ${index + 1}. ${reporter}: ${count} 次`);
                  });
                }
                if (stats.topMethods && stats.topMethods.length > 0) {
                  console.log("\n🔧 拦截最多的方法:");
                  stats.topMethods.forEach(([method, count], index) => {
                    console.log(`  ${index + 1}. ${method}(): ${count} 次`);
                  });
                }
                console.log("=".repeat(50));
              }
            };
            log("🔧 全局配置接口已设置");
          },
          /**
           * 打印初始化状态
           */
          printStatus() {
            console.log("\n" + "=".repeat(60));
            console.log("🛡️  Augment Code 安全拦截器 v2.5 状态报告");
            console.log("=".repeat(60));
            console.log(`📅 构建时间: ${INTERCEPTOR_CONFIG.buildTime}`);
            console.log(`🔧 调试模式: ${INTERCEPTOR_CONFIG.debugMode ? "✅ 启用" : "❌ 禁用"}`);
            console.log(`🆔 主会话ID: ${SessionManager.getMainSessionId()}`);
            console.log("\n📊 功能模块状态:");
            console.log(`  🎯 精确Event Reporter拦截: ${INTERCEPTOR_CONFIG.dataProtection.enablePreciseEventReporterControl ? "✅" : "❌"}`);
            console.log(`  🚫 API错误报告拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableApiServerErrorReportInterception ? "✅" : "❌"}`);
            console.log(`  🛡️ 安全Analytics拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableAnalyticsBlocking ? "✅" : "❌"}`);
            console.log(`  🔍 智能数据分类: ${INTERCEPTOR_CONFIG.dataProtection.enableSmartDataClassification ? "✅" : "❌"}`);
            console.log(`  🖥️ 系统API拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableSystemApiInterception ? "✅" : "❌"}`);
            console.log(`  🔧 系统命令拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableGitCommandInterception ? "✅" : "❌"}`);
            console.log(`  🎭 VSCode拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableVSCodeInterception ? "✅" : "❌"}`);
            console.log(`  🌐 网络请求拦截: ${INTERCEPTOR_CONFIG.network.enableFetchInterception ? "✅" : "❌"}`);
            console.log(`  📝 智能JSON拦截: ${INTERCEPTOR_CONFIG.dataProtection.enableJsonCleaning ? "✅" : "❌ (已禁用)"}`);
            console.log(`  🔒 增强白名单保护: ${INTERCEPTOR_CONFIG.dataProtection.enableEnhancedWhitelist ? "✅" : "❌"}`);
            console.log(`  🔍 被放行请求监控: ${INTERCEPTOR_CONFIG.network.logAllowedRequests ? "✅" : "❌"}`);
            console.log("\n🎯 拦截策略:");
            console.log(`  📊 遥测模式数量: ${TELEMETRY_PATTERNS.length}`);
            console.log(`  ✅ 代码索引白名单: ${CODE_INDEXING_PATTERNS.length}`);
            console.log(`  🎭 Event Reporter类型: ${EVENT_REPORTER_TYPES.length}`);
            console.log("\n💡 使用方法:");
            console.log("  - 查看状态: AugmentCodeInterceptor.getStatus()");
            console.log("  - 测试分类: AugmentCodeInterceptor.testDataClassification(data, context)");
            console.log("  - 重新生成ID: AugmentCodeInterceptor.regenerateSessionIds()");
            console.log("  - 系统访问统计: AugmentCodeInterceptor.getSystemAccessStats()");
            console.log("  - VSCode访问统计: AugmentCodeInterceptor.getVSCodeEnvAccessStats()");
            console.log("=".repeat(60) + "\n");
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
        MainInitializer.initializeAll();
        if (typeof module !== "undefined" && module.exports) {
          module.exports = {
            version: INTERCEPTOR_CONFIG.version,
            SmartDataClassifier,
            SessionManager,
            NetworkInterceptor,
            getStatus: () => MainInitializer.getDetailedStatus(),
            // 调试功能控制
            enableAllowedRequestLogging: () => {
              INTERCEPTOR_CONFIG.network.logAllowedRequests = true;
              console.log("[DEBUG] 被放行请求监控已启用");
            },
            disableAllowedRequestLogging: () => {
              INTERCEPTOR_CONFIG.network.logAllowedRequests = false;
              console.log("[DEBUG] 被放行请求监控已禁用");
            },
            setLogLimit: (limit) => {
              INTERCEPTOR_CONFIG.network.allowedRequestLogLimit = limit;
              console.log(`[DEBUG] 整个请求包日志长度限制设置为: ${limit}`);
            }
          };
        }
      })();
    }
  });
  require_src();
})();
