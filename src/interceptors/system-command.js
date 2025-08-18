/**
 * Augment Code Extension 系统命令拦截器
 * 
 * 拦截敏感的系统命令（Git、ioreg、注册表等），返回假信息
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log, logOnce } from '../utils/logger.js';
import { SystemInfoGenerator } from '../utils/system-info-generator.js';

/**
 * v2.5扩展：系统命令拦截器
 */
export const SystemCommandInterceptor = {
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
                // 如果有有效的输出（不是错误），就替换
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
                // 如果命令执行成功且返回了有效的URL，就替换
                if (!error && stdout && stdout.trim().length > 0) {
                    const output = stdout.trim();

                    // 增强的Git URL验证
                    const isValidGitUrl = SystemCommandInterceptor.isValidGitUrl(output);

                    if (isValidGitUrl) {
                        // 对于多行输出，显示第一行作为示例
                        const firstLine = output.split('\n')[0];
                        const displayOutput = output.includes('\n') ?
                            `${firstLine}... (${output.split('\n').length} 行)` :
                            output;
                        log(`🔍 检测到真实Git仓库URL，将进行替换: ${displayOutput}`);
                        return true;
                    } else {
                        log(`💡 输出不是有效的Git URL，不进行替换: ${output.substring(0, 100)}${output.length > 100 ? '...' : ''}`);
                        return false;
                    }
                }

                // 如果命令执行失败，检查错误信息
                if (error || stderr) {
                    const errorMessage = (stderr || error?.message || "").toLowerCase();

                    // 常见的"不是Git仓库"错误信息
                    const notGitRepoErrors = [
                        "fatal: not a git repository",
                        "not a git repository",
                        "fatal: no such remote",
                        "fatal: no upstream configured",
                        "fatal: 'origin' does not appear to be a git repository"
                    ];

                    // 系统级错误信息（不应该被替换）
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

                    const isNotGitRepo = notGitRepoErrors.some(errorPattern =>
                        errorMessage.includes(errorPattern)
                    );

                    const isSystemError = systemErrors.some(errorPattern =>
                        errorMessage.includes(errorPattern)
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
                // 对于其他命令，如果有输出就替换
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

        log('🔧 初始化系统命令拦截...');

        this.interceptChildProcess();

        log('✅ 系统命令拦截设置完成');
    },

    /**
     * 拦截child_process模块
     */
    interceptChildProcess() {
        if (typeof require !== 'undefined') {
            const originalRequire = require;

            require = function(moduleName) {
                const module = originalRequire.apply(this, arguments);

                if (moduleName === 'child_process') {
                    logOnce('🔧 拦截child_process模块...', 'child-process-module-intercept');
                    return SystemCommandInterceptor.createChildProcessProxy(module);
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

        // 检测macOS ioreg命令
        if (normalizedCommand.includes('ioreg')) {
            log(`🔍 检测到ioreg命令: ${command}`);

            // 分析具体的ioreg命令类型
            let ioregType = 'general';
            if (normalizedCommand.includes('-c ioplatformexpertdevice') ||
                normalizedCommand.includes('-c IOPlatformExpertDevice')) {
                ioregType = 'platform';
            } else if (normalizedCommand.includes('-p iousb') ||
                      normalizedCommand.includes('-p IOUSB')) {
                ioregType = 'usb';
            }

            return {
                isSensitive: true,
                shouldReplace: true,
                commandType: 'ioreg',
                ioregType: ioregType
            };
        }

        // 检测Windows注册表命令
        if (normalizedCommand.includes('reg query') ||
            normalizedCommand.includes('reg.exe query') ||
            normalizedCommand.includes('wmic') ||
            normalizedCommand.includes('systeminfo')) {
            log(`🔍 检测到Windows注册表命令: ${command}`);
            return {
                isSensitive: true,
                shouldReplace: true,
                commandType: 'registry'
            };
        }

        // 检测Git命令
        if (normalizedCommand.includes('git ') || normalizedCommand.startsWith('git')) {
            const gitAnalysis = this.analyzeGitCommand(command, error, stdout, stderr);
            return {
                isSensitive: gitAnalysis.isSensitive,
                shouldReplace: gitAnalysis.shouldReplace,
                commandType: 'git',
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

        // 遍历所有配置类型
        for (const [configType, config] of Object.entries(this.commandConfig)) {
            // 检查是否匹配任何模式
            const isMatch = config.patterns.some(pattern =>
                normalizedCommand.includes(pattern.toLowerCase())
            );

            if (isMatch) {
                const shouldReplace = config.shouldReplace(command, error, stdout, stderr);
                return {
                    isSensitive: true,
                    shouldReplace: shouldReplace,
                    configType: configType
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
        const self = this;

        return new Proxy(originalCP, {
            get(target, prop) {
                if (prop === 'exec') {
                    return function(command, options, callback) {
                        // 使用扩展的系统命令分析方法
                        const analysis = self.analyzeSystemCommand(command);

                        if (analysis.isSensitive) {
                            log(`🔍 检测到敏感系统exec命令: ${command} (类型: ${analysis.commandType})`);

                            // 先执行原始命令获取真实结果
                            const originalExec = target[prop].bind(target);

                            if (typeof options === 'function') {
                                callback = options;
                                options = {};
                            }

                            return originalExec(command, options, (error, stdout, stderr) => {
                                // 重新分析，这次包含执行结果
                                const finalAnalysis = self.analyzeSystemCommand(command, error, stdout, stderr);

                                if (finalAnalysis.shouldReplace) {
                                    let fakeOutput = stdout;

                                    // 根据命令类型选择相应的伪造方法
                                    switch (finalAnalysis.commandType) {
                                        case 'ioreg':
                                            fakeOutput = self.spoofIoregOutput(stdout, finalAnalysis.ioregType);
                                            log(`🚫 拦截并替换ioreg命令输出 (${finalAnalysis.ioregType}): ${command}`);
                                            break;
                                        case 'registry':
                                            fakeOutput = self.spoofWindowsRegistryOutput(stdout, command);
                                            log(`🚫 拦截并替换Windows注册表命令输出: ${command}`);
                                            break;
                                        case 'git':
                                            fakeOutput = self.getFakeGitResponse(command);
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
        if (!url || typeof url !== 'string') return false;

        const trimmedUrl = url.trim();

        // 处理多行输出（如 git remote -v 的输出）
        const lines = trimmedUrl.split('\n');
        if (lines.length > 1) {
            // 检查每一行是否包含有效的Git URL
            return lines.some(line => this.isValidGitUrl(line.trim()));
        }

        // 提取URL部分（处理 "origin https://github.com/user/repo.git (fetch)" 格式）
        const urlMatch = trimmedUrl.match(/(?:https?:\/\/|git@|git:\/\/)[^\s]+/);
        const actualUrl = urlMatch ? urlMatch[0] : trimmedUrl;

        // 增强的Git URL格式检查
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

        // 检查是否匹配任何Git URL模式
        const isValidFormat = gitUrlPatterns.some(pattern => pattern.test(actualUrl));

        if (isValidFormat) {
            log(`✅ 有效的Git URL格式: ${actualUrl}`);
            return true;
        }

        // 额外检查：包含常见Git托管服务域名
        const gitHostingDomains = [
            'github.com', 'gitlab.com', 'bitbucket.org', 'gitee.com',
            'coding.net', 'dev.azure.com', 'visualstudio.com',
            'sourceforge.net', 'codeberg.org'
        ];

        const containsGitDomain = gitHostingDomains.some(domain =>
            actualUrl.toLowerCase().includes(domain)
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
            // 默认返回空字符串
            log(`🎭 Git命令无特定响应，返回空字符串: ${command}`);
            return "";
        }
    },

    /**
     * 生成假的Git邮箱
     * @returns {string} 假邮箱
     */
    generateFakeEmail() {
        const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
        const usernames = ['john.doe', 'jane.smith', 'alex.wilson', 'sarah.johnson', 'mike.brown'];

        const username = usernames[Math.floor(Math.random() * usernames.length)];
        const domain = domains[Math.floor(Math.random() * domains.length)];

        return `${username}@${domain}`;
    },

    /**
     * 生成假的Git用户名
     * @returns {string} 假用户名
     */
    generateFakeName() {
        const firstNames = ['John', 'Jane', 'Alex', 'Sarah', 'Mike', 'Emily', 'David', 'Lisa'];
        const lastNames = ['Doe', 'Smith', 'Wilson', 'Johnson', 'Brown', 'Davis', 'Miller', 'Garcia'];

        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

        return `${firstName} ${lastName}`;
    },

    /**
     * 生成假的Git仓库URL
     * @returns {string} 假仓库URL
     */
    generateFakeGitUrl() {
        const hosts = ['github.com', 'gitlab.com', 'bitbucket.org'];
        const users = ['johndoe', 'janesmith', 'alexwilson', 'sarahjohnson'];
        const repos = ['my-project', 'awesome-app', 'cool-tool', 'sample-repo'];

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
    spoofIoregOutput(output, ioregType = 'general') {
        // 如果没有原始输出，根据命令类型生成假输出
        if (!output || typeof output !== "string" || output.trim().length === 0) {
            return this.generateFakeIoregOutput(ioregType);
        }

        let spoofed = output;
        const fakeUUID = INTERCEPTOR_CONFIG.system.macUUID;
        const fakeSerial = INTERCEPTOR_CONFIG.system.macSerial;
        const fakeBoardId = INTERCEPTOR_CONFIG.system.macBoardId;

        // 替换UUID模式
        const uuidPattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}/gi;
        spoofed = spoofed.replace(uuidPattern, fakeUUID);

        // 替换序列号模式
        const serialPattern = /"IOPlatformSerialNumber" = "([^"]+)"/g;
        spoofed = spoofed.replace(serialPattern, `"IOPlatformSerialNumber" = "${fakeSerial}"`);

        // 替换主板ID模式
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

            // 架构检测（在switch外面声明避免重复）
            const realArch = process.arch;
            const isAppleSilicon = realArch === 'arm64';

            log(`🎭 生成假的ioreg输出 (类型: ${ioregType}), 使用型号: ${fakeModel}, 架构: ${realArch}`);

            switch (ioregType) {
                case 'platform':
                    // 根据架构选择不同的platform输出

                    // 生成动态变化的值
                    const dynamicDeviceId = `0x${(0x100000115 + Math.floor(Math.random() * 50)).toString(16)}`;
                    const dynamicBusyTime = Math.floor(Math.random() * 10); // 0-10ms
                    const dynamicRetain = 45 + Math.floor(Math.random() * 15); // 45-60

                    if (isAppleSilicon) {
                        // M系列Mac platform输出
                        const dynamicSystemMemory = Math.floor(Math.random() * 3) + 1; // 1-4 (表示8GB-32GB)
                        const systemMemoryHex = `000000000${dynamicSystemMemory.toString(16).padStart(7, '0')}00000000`;
                        const dynamicSessionId = 100000 + Math.floor(Math.random() * 10000); // 100000-110000
                        const dynamicUserId = 500 + Math.floor(Math.random() * 10); // 500-510
                        const dynamicGroupId = 20 + Math.floor(Math.random() * 5); // 20-25
                        const dynamicCGSSessionId = 250 + Math.floor(Math.random() * 50); // 250-300

                        // 根据fakeModel生成对应的compatible和board-id
                        let compatibleValue, boardIdValue, targetTypeValue;
                        if (fakeModel.includes('Macmini')) {
                            compatibleValue = `"${fakeModel}","J274AP"`;
                            boardIdValue = "Mac-747B3727A59523C5";
                            targetTypeValue = "Mac";
                        } else if (fakeModel.includes('MacBookAir')) {
                            compatibleValue = `"${fakeModel}","J313AP"`;
                            boardIdValue = "Mac-827FB448E656EC26";
                            targetTypeValue = "Mac";
                        } else if (fakeModel.includes('MacBookPro')) {
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
        "IOConsoleUsers" = ({"kCGSSessionUserNameKey"="user","kCGSSessionOnConsoleKey"=Yes,"kSCSecuritySessionID"=${dynamicSessionId},"kCGSSessionLoginwindowSafeLogin"=No,"kCGSSessionID"=${dynamicCGSSessionId},"kCGSSessionSystemSafeBoot"=No,"kCGSSessionAuditID"=${dynamicSessionId},"kCGSSessionUserIDKey"=${dynamicUserId},"kCGSSessionGroupIDKey"=${dynamicGroupId}})
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
                        // Intel Mac platform输出（保持原有的Intel版本）
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

                case 'usb':
                    // 根据架构选择不同的USB设备树
                    // 生成动态变化的值
                    const dynamicSessionId = Math.floor(Math.random() * 1000000000) + 900000000; // 900M-1.9B范围
                    const generateDeviceId = (base) => `0x${(base + Math.floor(Math.random() * 100)).toString(16)}`;
                    const generateUsbAddress = () => Math.floor(Math.random() * 6) + 2; // 2-8
                    const generateLocationId = (base) => base + Math.floor(Math.random() * 1000);

                    if (isAppleSilicon) {
                        // M系列Mac USB设备树
                        const dynamicT6000Id1 = `0x${(0x100000181 + Math.floor(Math.random() * 20)).toString(16)}`;
                        const dynamicT6000Id2 = `0x${(0x100000181 + Math.floor(Math.random() * 20)).toString(16)}`;
                        const dynamicXHCId1 = `0x${(0x1000002f1 + Math.floor(Math.random() * 30)).toString(16)}`;
                        const dynamicXHCId2 = `0x${(0x100000311 + Math.floor(Math.random() * 30)).toString(16)}`;
                        const dynamicRootHubId1 = `0x${(0x1000002f4 + Math.floor(Math.random() * 50)).toString(16)}`;
                        const dynamicRootHubId2 = `0x${(0x100000314 + Math.floor(Math.random() * 50)).toString(16)}`;
                        const dynamicRetain1 = 20 + Math.floor(Math.random() * 10); // 20-30
                        const dynamicRetain2 = 12 + Math.floor(Math.random() * 8); // 12-20

                        // M系列Mac外设随机删减
                        const includeKeyboard = Math.random() > 0.05; // 95%概率包含内置键盘（几乎总是存在）
                        const includeAmbientLight = Math.random() > 0.1; // 90%概率包含环境光传感器
                        const includeUSBCAdapter = Math.random() > 0.4; // 60%概率包含USB-C适配器
                        const includeDellMonitor = Math.random() > 0.3; // 70%概率包含Dell显示器
                        const includeUnifyingReceiver = Math.random() > 0.5; // 50%概率包含罗技接收器
                        const includeUSBDrive = Math.random() > 0.6; // 40%概率包含U盘
                        const includeiPhone = Math.random() > 0.4; // 60%概率包含iPhone

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
    |   +-o AppleUSB20Hub@01100000  <class AppleUSB20Hub, id ${generateDeviceId(0x1000002f6)}, retain 16, depth 4>
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
    |   | +-o Apple Internal Keyboard / Trackpad@01110000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000300)}, retain 20, depth 5>
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
    |   | | ` : ''}${includeAmbientLight ? `
    |   | +-o Ambient Light Sensor@01120000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000301)}, retain 12, depth 5>
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
    |   |   }` : ''}
    |   |
    |   +-o AppleUSB30Hub@01200000  <class AppleUSB30Hub, id ${generateDeviceId(0x100000305)}, retain 18, depth 4>
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
    |     +-o USB C Video Adaptor@01210000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008bd)}, retain 14, depth 5>
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
    |     | +-o USB2.0 Hub@01210000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008cd)}, retain 15, depth 6>
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
    |     |   +-o Cruzer Blade@01214000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008d3)}, retain 15, depth 7>
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
    |     |     }` : ''}
    |     |     ` : ''}${includeDellMonitor ? `
    |     +-o Dell U3223QE @01230000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008e3)}, retain 15, depth 5>
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
    |       +-o USB2.0 Hub@01230000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008f4)}, retain 14, depth 6>
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
    |         +-o Unifying Receiver@01231000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000008fb)}, retain 16, depth 7>
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
    |           }` : ''}` : ''}
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
        +-o AppleUSB20Hub@00100000  <class AppleUSB20Hub, id ${generateDeviceId(0x100000316)}, retain 13, depth 4>
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
        | +-o iPhone@00110000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000913)}, retain 20, depth 5>
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
        |   }` : ''}
        |
        +-o AppleUSB30Hub@00200000  <class AppleUSB30Hub, id ${generateDeviceId(0x100000325)}, retain 12, depth 4>
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
                        // Intel Mac USB设备树
                        const dynamicRootHubId = `0x${(0x10000032b + Math.floor(Math.random() * 50)).toString(16)}`;
                        const dynamicRetain = 25 + Math.floor(Math.random() * 10); // 25-35
                        const dynamicXHCId = `0x${(0x1000002f2 + Math.floor(Math.random() * 30)).toString(16)}`;
                        const dynamicACPIId = `0x${(0x100000118 + Math.floor(Math.random() * 20)).toString(16)}`;
                        const dynamicExpertId = `0x${(0x100000116 + Math.floor(Math.random() * 10)).toString(16)}`;

                        // Intel Mac外设随机删减
                        const includeDellMonitor = Math.random() > 0.3; // 70%概率包含Dell显示器
                        const includeT2Controller = Math.random() > 0.1; // 90%概率包含T2控制器（内置）
                        const includeCalDigit = Math.random() > 0.5; // 50%概率包含CalDigit扩展坞
                        const includeWebcam = Math.random() > 0.4; // 60%概率包含摄像头
                        const includeUSBDrive = Math.random() > 0.6; // 40%概率包含U盘

                        log(`🎭 生成Intel Mac动态USB设备树 - 会话ID: ${dynamicSessionId}, 外设: Dell显示器=${includeDellMonitor}, T2控制器=${includeT2Controller}, CalDigit=${includeCalDigit}, 摄像头=${includeWebcam}, U盘=${includeUSBDrive}`);

                        return `+-o Root  <class IORegistryEntry, id 0x100000100, retain 26, depth 0>
  +-o AppleACPIPlatformExpert  <class AppleACPIPlatformExpert, id ${dynamicExpertId}, retain 42, depth 1>
    +-o AppleACPIPCI  <class AppleACPIPCI, id ${dynamicACPIId}, retain 41, depth 2>
      +-o XHC1@14  <class AppleIntelCNLUSBXHCI, id ${dynamicXHCId}, retain 52, depth 3>
        +-o AppleUSBRootHubDevice  <class AppleUSBRootHubDevice, id ${dynamicRootHubId}, retain ${dynamicRetain}, depth 4>
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
          +-o HS01@14100000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003b5)}, retain 12, depth 5>
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
          +-o HS02@14200000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003b6)}, retain 15, depth 5>
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
          | +-o Dell U3219Q @14200000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000851)}, retain 14, depth 6>
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
          |   }` : ''}
          |
          +-o HS03@14300000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003bd)}, retain 12, depth 5>
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
          +-o HS04@14400000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003be)}, retain 12, depth 5>
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
          +-o HS05@14500000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003bf)}, retain 17, depth 5>
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
          | +-o Apple T2 Controller@14500000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003c2)}, retain 30, depth 6>
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
          |   }` : ''}
          |
          +-o SS01@14600000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003e8)}, retain 12, depth 5>
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
          +-o SS02@14700000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003e9)}, retain 15, depth 5>
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
          | +-o Dell U3219Q @14700000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000854)}, retain 13, depth 6>
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
          |   }` : ''}
          |
          +-o SS03@14800000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003ea)}, retain 15, depth 5>
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
          | +-o CalDigit TS3 Plus@14800000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000858)}, retain 15, depth 6>
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
          |   }` : ''}
          |
          +-o SS04@14900000  <class IOUSBHostDevice, id ${generateDeviceId(0x1000003eb)}, retain 12, depth 5>
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
          +-o USR1@14a00000  <class IOUSBHostDevice, id ${generateDeviceId(0x10000041b)}, retain 15, depth 5>
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
            +-o Billboard Device@14a00000  <class IOUSBHostDevice, id ${generateDeviceId(0x10000085c)}, retain 13, depth 6>
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
            +-o USB2.0 Hub@14a10000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000863)}, retain 16, depth 6>
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
              +-o C922 Pro Stream Webcam@14a11000  <class IOUSBHostDevice, id ${generateDeviceId(0x10000086b)}, retain 20, depth 7>
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
              | ` : ''}${includeUSBDrive ? `
              +-o Cruzer Blade@14a14000  <class IOUSBHostDevice, id ${generateDeviceId(0x100000877)}, retain 15, depth 7>
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
                }` : ''}`;
                    }

                default:
                    // 通用ioreg输出
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
        spoofWindowsRegistryOutput(output, command = '') {
            log(`🎭 开始伪造Windows注册表输出...`);
            log(`📋 原始输出长度: ${output ? output.length : 0} 字符`);
            log(`🔍 命令上下文: ${command}`);

            // 如果输出为空，生成逼真的注册表数据
            if (!output || typeof output !== "string" || output.trim() === "") {
                log(`🔧 检测到空输出，生成逼真的注册表数据`);
                return this.generateRealisticRegistryOutput(command);
            }

            // 如果有真实输出，替换其中的敏感值
            let spoofed = output;

            // 确保缓存值存在
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

            // 替换MachineGuid（使用缓存的值）
            const machineGuidPattern = /(MachineGuid\s+REG_SZ\s+)[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/g;
            const guidMatches = output.match(machineGuidPattern);
            if (guidMatches) {
                log(`🔍 发现${guidMatches.length}个MachineGuid，将替换为: ${fakeMachineGuid}`);
                spoofed = spoofed.replace(machineGuidPattern, `$1${fakeMachineGuid}`);
            }

            // 替换FeatureSet（使用缓存的值）
            const featureSetPattern = /(FeatureSet\s+REG_DWORD\s+)0x[0-9A-Fa-f]{8}/g;
            const featureMatches = output.match(featureSetPattern);
            if (featureMatches) {
                log(`🔍 发现${featureMatches.length}个FeatureSet，将替换为: ${fakeFeatureSet}`);
                spoofed = spoofed.replace(featureSetPattern, `$1${fakeFeatureSet}`);
            }

            // 替换ProductId
            const productIdPattern = /(ProductId\s+REG_SZ\s+)[A-Z0-9\-]+/g;
            const productMatches = output.match(productIdPattern);
            if (productMatches) {
                log(`🔍 发现${productMatches.length}个ProductId，将替换为: ${fakeProductId}`);
                spoofed = spoofed.replace(productIdPattern, `$1${fakeProductId}`);
            }

            // 替换SerialNumber
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

        // 检测MachineGuid查询
        if (commandLower.includes('machineguid')) {
            return this.generateMachineGuidOutput();
        }

        // 检测ProductId查询
        if (commandLower.includes('productid')) {
            return this.generateProductIdOutput();
        }

        // 检测WMIC命令
        if (commandLower.includes('wmic')) {
            return this.generateWmicOutput(command);
        }

        // 检测systeminfo命令
        if (commandLower.includes('systeminfo')) {
            return this.generateSystemInfoOutput();
        }

        // 默认返回通用的注册表查询结果
        log(`⚠️ 未识别的注册表查询类型，返回通用输出`);
        return this.generateGenericRegistryOutput();
    },

    /**
     * 生成MachineGuid查询的输出
     * @returns {string} MachineGuid注册表输出
     */
    generateMachineGuidOutput() {
        // 使用缓存的GUID，如果没有则生成一个并缓存
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
        // 使用缓存的ProductId，如果没有则生成一个并缓存
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
        return [8,4,4,4,12].map(len =>
            Array.from({length: len}, () =>
                Math.floor(Math.random() * 16).toString(16)
            ).join('')
        ).join('-').toUpperCase();
    },

    /**
     * 生成随机ProductId
     * @returns {string} 随机ProductId
     */
    generateRandomProductId() {
        // Windows ProductId格式: XXXXX-XXX-XXXXXXX-XXXXX
        const part1 = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');
        const part2 = Array.from({length: 3}, () => Math.floor(Math.random() * 10)).join('');
        const part3 = Array.from({length: 7}, () => Math.floor(Math.random() * 10)).join('');
        const part4 = Array.from({length: 5}, () => Math.floor(Math.random() * 10)).join('');

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

        // 检测BIOS序列号查询
        if (commandLower.includes('bios') && commandLower.includes('serialnumber')) {
            return this.generateWmicBiosSerialNumber();
        }

        // 检测网络适配器MAC地址查询
        if (commandLower.includes('networkadapter') && commandLower.includes('macaddress')) {
            return this.generateWmicNetworkMac();
        }

        // 检测系统信息查询
        if (commandLower.includes('computersystem')) {
            if (commandLower.includes('manufacturer')) {
                return this.generateWmicSystemManufacturer();
            } else if (commandLower.includes('model')) {
                return this.generateWmicSystemModel();
            } else {
                return this.generateWmicSystemInfo();
            }
        }

        // 默认WMIC输出
        log(`⚠️ 未识别的WMIC命令类型: ${command}`);
        return this.generateGenericWmicOutput();
    },

    /**
     * 生成WMIC BIOS序列号输出
     * @returns {string} BIOS序列号输出
     */
    generateWmicBiosSerialNumber() {
        // 使用缓存的序列号，如果没有则生成一个并缓存
        if (!INTERCEPTOR_CONFIG.system.winBiosSerial) {
            INTERCEPTOR_CONFIG.system.winBiosSerial = this.generateRandomSerial();
            log(`🔧 首次生成并缓存BIOS序列号: ${INTERCEPTOR_CONFIG.system.winBiosSerial}`);
        }

        const fakeSerial = INTERCEPTOR_CONFIG.system.winBiosSerial;
        log(`🔧 使用缓存的BIOS序列号: ${fakeSerial}`);

        return `SerialNumber\n${fakeSerial}`;
    },

    /**
     * 生成随机序列号
     * @returns {string} 随机序列号
     */
    generateRandomSerial() {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return Array.from({length: 10}, () =>
            chars[Math.floor(Math.random() * chars.length)]
        ).join("");
    },

    /**
     * 生成WMIC网络MAC地址输出
     * @returns {string} MAC地址输出
     */
    generateWmicNetworkMac() {
        // 使用缓存的MAC地址，如果没有则生成一个并缓存
        if (!INTERCEPTOR_CONFIG.system.winMacAddress) {
            INTERCEPTOR_CONFIG.system.winMacAddress = this.generateRandomMacAddress();
            log(`🔧 首次生成并缓存MAC地址: ${INTERCEPTOR_CONFIG.system.winMacAddress}`);
        }

        const fakeMac = INTERCEPTOR_CONFIG.system.winMacAddress;
        log(`🔧 使用缓存的MAC地址: ${fakeMac}`);

        return `MACAddress\n${fakeMac}`;
    },

    /**
     * 生成随机MAC地址
     * @returns {string} 随机MAC地址
     */
    generateRandomMacAddress() {
        // 生成符合IEEE标准的MAC地址，第一个字节设置为本地管理地址
        const firstByte = (Math.floor(Math.random() * 128) * 2 + 2).toString(16).padStart(2, '0').toUpperCase();
        const otherBytes = Array.from({length: 5}, () =>
            Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        );

        return [firstByte, ...otherBytes].join(':');
    },

    /**
     * 生成WMIC系统制造商输出
     * @returns {string} 系统制造商输出
     */
    generateWmicSystemManufacturer() {
        // 使用缓存的制造商，确保与systeminfo一致
        if (INTERCEPTOR_CONFIG.system.winSystemManufacturer) {
            const manufacturer = INTERCEPTOR_CONFIG.system.winSystemManufacturer;
            log(`🔧 使用缓存的系统制造商: ${manufacturer}`);
            return `Manufacturer\n${manufacturer}`;
        }

        // 如果没有缓存，生成新的并缓存
        const manufacturers = [
            'Dell Inc.', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI',
            'Apple Inc.', 'Microsoft Corporation', 'Samsung Electronics Co., Ltd.'
        ];

        const manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
        INTERCEPTOR_CONFIG.system.winSystemManufacturer = manufacturer;
        log(`🔧 首次生成并缓存系统制造商: ${manufacturer}`);

        return `Manufacturer\n${manufacturer}`;
    },

    /**
     * 生成WMIC系统型号输出
     * @returns {string} 系统型号输出
     */
    generateWmicSystemModel() {
        // 使用缓存的型号，确保与systeminfo一致
        if (INTERCEPTOR_CONFIG.system.winSystemModel) {
            const model = INTERCEPTOR_CONFIG.system.winSystemModel;
            log(`🔧 使用缓存的系统型号: ${model}`);
            return `Model\n${model}`;
        }

        // 如果没有缓存，生成新的并缓存
        const models = [
            'OptiPlex 7090', 'EliteDesk 800 G8', 'ThinkCentre M720q',
            'PRIME B450M-A', 'Aspire TC-895', 'MAG B550 TOMAHAWK'
        ];

        const model = models[Math.floor(Math.random() * models.length)];
        INTERCEPTOR_CONFIG.system.winSystemModel = model;
        log(`🔧 首次生成并缓存系统型号: ${model}`);

        return `Model\n${model}`;
    },

    /**
     * 生成WMIC系统信息输出
     * @returns {string} 系统信息输出
     */
    generateWmicSystemInfo() {
        const manufacturer = INTERCEPTOR_CONFIG.system.winSystemManufacturer || 'Dell Inc.';
        const model = INTERCEPTOR_CONFIG.system.winSystemModel || 'OptiPlex 7090';
        const uuid = INTERCEPTOR_CONFIG.system.winSystemUuid || this.generateRandomGuid().toUpperCase();

        return `Manufacturer  Model         UUID\n${manufacturer}     ${model} {${uuid}}`;
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

        // 确保缓存值存在
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
        // 使用与os.hostname()相同的hostname，但转换为Windows格式
        let hostName = INTERCEPTOR_CONFIG.system.hostname;

        // 如果hostname是Unix风格的，转换为Windows风格
        if (hostName && hostName.includes('-') && !hostName.toUpperCase().startsWith('DESKTOP-')) {
            // 将Unix风格的hostname转换为Windows风格
            hostName = 'DESKTOP-' + hostName.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 6);
            log(`🔧 将hostname从Unix风格转换为Windows风格: ${INTERCEPTOR_CONFIG.system.hostname} -> ${hostName}`);
        } else if (!hostName) {
            // 如果没有hostname，生成一个Windows风格的
            hostName = this.generateRandomHostName();
            log(`🔧 生成新的Windows风格hostname: ${hostName}`);
        }

        const osVersions = [
            { name: 'Microsoft Windows 11 Pro', version: '10.0.26100 N/A Build 26100' },
            { name: 'Microsoft Windows 11 Home', version: '10.0.26100 N/A Build 26100' },
            { name: 'Microsoft Windows 10 Pro', version: '10.0.19045 N/A Build 19045' },
            { name: 'Microsoft Windows 10 Home', version: '10.0.19045 N/A Build 19045' }
        ];
        const osInfo = osVersions[Math.floor(Math.random() * osVersions.length)];

        // 使用缓存的制造商和型号，确保与WMIC一致
        let manufacturer, model;
        if (INTERCEPTOR_CONFIG.system.winSystemManufacturer && INTERCEPTOR_CONFIG.system.winSystemModel) {
            manufacturer = INTERCEPTOR_CONFIG.system.winSystemManufacturer;
            model = INTERCEPTOR_CONFIG.system.winSystemModel;
        } else {
            const manufacturers = ['Dell Inc.', 'HP', 'Lenovo', 'ASUS'];
            manufacturer = manufacturers[Math.floor(Math.random() * manufacturers.length)];
            model = this.getSystemModelsForManufacturer(manufacturer)[0];

            INTERCEPTOR_CONFIG.system.winSystemManufacturer = manufacturer;
            INTERCEPTOR_CONFIG.system.winSystemModel = model;
            log(`🔧 首次生成并缓存系统制造商: ${manufacturer}, 型号: ${model}`);
        }

        // 生成内存信息 (常见配置)
        const memoryConfigs = [
            { total: 8192, available: 5120 },    // 8GB
            { total: 16384, available: 10240 },  // 16GB
            { total: 32768, available: 20480 },  // 32GB
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
            'Dell Inc.': ['OptiPlex 7090', 'OptiPlex 5090', 'Vostro 3681'],
            'HP': ['EliteDesk 800 G8', 'ProDesk 400 G7', 'Pavilion Desktop'],
            'Lenovo': ['ThinkCentre M720q', 'IdeaCentre 5', 'Legion Tower 5i'],
            'ASUS': ['PRIME B450M-A', 'ROG Strix B550-F', 'TUF Gaming B450M']
        };
        return modelMap[manufacturer] || ['Desktop', 'Computer', 'PC'];
    },

    /**
     * 获取处理器信息 (systeminfo格式)
     * @returns {Array} 处理器信息数组
     */
    getProcessorInfoForSystemInfo() {
        return [
            'Intel64 Family 6 Model 183 Stepping 1 GenuineIntel ~2200 Mhz',
            'Intel64 Family 6 Model 165 Stepping 2 GenuineIntel ~2900 Mhz',
            'AMD64 Family 25 Model 33 Stepping 0 AuthenticAMD ~3600 Mhz'
        ];
    },

    /**
     * 根据制造商获取BIOS版本
     * @param {string} manufacturer - 制造商
     * @returns {Array} BIOS版本数组
     */
    getBiosVersionsForManufacturer(manufacturer) {
        const biosMap = {
            'Dell Inc.': ['Dell Inc. 2.18.0, 12/15/2023', 'Dell Inc. 2.17.0, 11/20/2023'],
            'HP': ['HP F.49, 10/25/2023', 'HP F.48, 09/15/2023'],
            'Lenovo': ['Lenovo M1AKT59A, 11/30/2023', 'Lenovo M1AKT58A, 10/20/2023'],
            'ASUS': ['American Megatrends Inc. 4021, 12/01/2023', 'American Megatrends Inc. 4020, 11/01/2023']
        };
        return biosMap[manufacturer] || ['BIOS Version 1.0, 01/01/2023'];
    },

    /**
     * 生成随机主机名
     * @returns {string} 随机主机名
     */
    generateRandomHostName() {
        const prefixes = ['DESKTOP', 'PC', 'WORKSTATION', 'COMPUTER', 'WIN'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = Array.from({length: 6}, () =>
            Math.floor(Math.random() * 36).toString(36).toUpperCase()
        ).join('');

        return `${prefix}-${suffix}`;
    },

    /**
     * 生成随机安装日期
     * @returns {string} 随机安装日期
     */
    generateRandomInstallDate() {
        const year = 2023 + Math.floor(Math.random() * 2); // 2023-2024
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;

        return `${month}/${day}/${year}, 10:30:00 AM`;
    },

    /**
     * 生成随机启动时间
     * @returns {string} 随机启动时间
     */
    generateRandomBootTime() {
        const now = new Date();
        const hoursAgo = Math.floor(Math.random() * 24) + 1; // 1-24小时前
        const bootTime = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);

        const month = bootTime.getMonth() + 1;
        const day = bootTime.getDate();
        const year = bootTime.getFullYear();
        const hour = bootTime.getHours();
        const minute = bootTime.getMinutes();
        const second = bootTime.getSeconds();

        return `${month}/${day}/${year}, ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
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

        // 生成网卡信息
        const networkCards = this.generateNetworkCardsInfo();

        // 生成热修复信息
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
                        name: 'Intel(R) Wi-Fi 6E AX211 160MHz',
                        connection: 'Internet',
                        dhcp: true,
                        dhcpServer: '192.168.1.1',
                        ips: ['192.168.1.100', 'fe80::1234:5678:9abc:def0']
                    },
                    {
                        name: 'Realtek PCIe GbE Family Controller',
                        connection: 'Ethernet',
                        dhcp: false,
                        ips: ['192.168.0.100', 'fe80::abcd:ef12:3456:7890']
                    },
                    {
                        name: 'Bluetooth Device (Personal Area Network)',
                        connection: 'Bluetooth Network Connection',
                        status: 'Media disconnected'
                    }
                ]
            },
            {
                count: 4,
                cards: [
                    {
                        name: 'Intel(R) Ethernet Connection I219-V',
                        connection: 'Ethernet',
                        dhcp: true,
                        dhcpServer: '10.0.0.1',
                        ips: ['10.0.0.50', 'fe80::2468:ace0:1357:9bdf']
                    },
                    {
                        name: 'Intel(R) Wi-Fi 6 AX200 160MHz',
                        connection: 'Wi-Fi',
                        dhcp: true,
                        dhcpServer: '192.168.1.1',
                        ips: ['192.168.1.150', 'fe80::9876:5432:10ab:cdef']
                    },
                    {
                        name: 'VMware Virtual Ethernet Adapter for VMnet1',
                        connection: 'VMware Network Adapter VMnet1',
                        dhcp: false,
                        ips: ['192.168.192.1', 'fe80::3b21:3ecb:808e:67b8']
                    },
                    {
                        name: 'Bluetooth Device (Personal Area Network)',
                        connection: 'Bluetooth Network Connection',
                        status: 'Media disconnected'
                    }
                ]
            }
        ];

        const config = networkConfigs[Math.floor(Math.random() * networkConfigs.length)];
        let output = `Network Card(s):               ${config.count} NIC(s) Installed.\n`;

        config.cards.forEach((card, index) => {
            const cardNum = (index + 1).toString().padStart(2, '0');
            output += `                               [${cardNum}]: ${card.name}\n`;
            output += `                                     Connection Name: ${card.connection}\n`;

            if (card.status) {
                output += `                                     Status:          ${card.status}\n`;
            } else {
                if (card.dhcp !== undefined) {
                    output += `                                     DHCP Enabled:    ${card.dhcp ? 'Yes' : 'No'}\n`;
                }
                if (card.dhcpServer) {
                    output += `                                     DHCP Server:     ${card.dhcpServer}\n`;
                }
                if (card.ips && card.ips.length > 0) {
                    output += `                                     IP address(es)\n`;
                    card.ips.forEach((ip, ipIndex) => {
                        const ipNum = (ipIndex + 1).toString().padStart(2, '0');
                        output += `                                     [${ipNum}]: ${ip}\n`;
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
            ['KB5056579', 'KB5062660', 'KB5063666', 'KB5064485'],
            ['KB5055999', 'KB5061001', 'KB5062562', 'KB5063228'],
            ['KB5057144', 'KB5060414', 'KB5061566', 'KB5063950'],
            ['KB5058204', 'KB5061317', 'KB5062746', 'KB5064718']
        ];

        const hotfixes = hotfixSets[Math.floor(Math.random() * hotfixSets.length)];
        let output = `Hotfix(s):                     ${hotfixes.length} Hotfix(s) Installed.\n`;

        hotfixes.forEach((hotfix, index) => {
            const hotfixNum = (index + 1).toString().padStart(2, '0');
            output += `                               [${hotfixNum}]: ${hotfix}\n`;
        });

        return output.trim();
    }
};
