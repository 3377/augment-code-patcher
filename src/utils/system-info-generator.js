/**
 * Augment Code Extension 系统信息生成器
 * 
 * 生成逼真的假系统信息，支持平台感知
 */

import { INTERCEPTOR_CONFIG } from '../config.js';
import { log } from './logger.js';

/**
 * 系统信息生成器
 */
export const SystemInfoGenerator = {
    /**
     * 生成完整的假系统信息（平台感知版）
     */
    generateFakeSystemInfo() {
        // 获取真实平台信息用于生成对应的假信息
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

        // 根据平台添加特定的标识符
        if (realPlatform === 'darwin') {
            baseInfo.macUUID = this.generateMacUUID();
            baseInfo.macSerial = this.generateMacSerial();
            baseInfo.macBoardId = this.generateMacBoardId();
            baseInfo.macModel = this.generateMacModel();
            log(`🍎 生成macOS特定信息`);
        } else if (realPlatform === 'win32') {
            baseInfo.winGuid = this.generateWindowsGuid();
            baseInfo.winProductId = this.generateWindowsProductId();
            baseInfo.winSerial = this.generateWindowsSerial();
            log(`🪟 生成Windows特定信息`);
        } else {
            // Linux或其他平台
            baseInfo.linuxMachineId = this.generateLinuxMachineId();
            log(`🐧 生成Linux特定信息`);
        }

        return baseInfo;
    },

    /**
     * 生成Mac UUID
     */
    generateMacUUID() {
        return [8,4,4,4,12].map(len =>
            Array.from({length: len}, () =>
                "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
            ).join("")
        ).join("-");
    },

    /**
     * 生成Mac序列号（支持M系列处理器，使用真实前缀）
     */
    generateMacSerial() {
        // 获取真实架构来决定序列号格式
        const realArch = process.arch;

        // M系列处理器使用不同的序列号前缀
        const prefixes = realArch === 'arm64' ? [
            // M系列处理器序列号前缀
            'C02',  // 通用前缀
            'F4H',  // M1 MacBook Air
            'F86',  // M1 MacBook Pro
            'G8V',  // M1 iMac
            'H7J',  // M1 Pro MacBook Pro
            'J1G',  // M1 Max MacBook Pro
            'K2H',  // M2 MacBook Air
            'L3M',  // M2 MacBook Pro
            'M9N',  // M2 Pro MacBook Pro
            'N5P',  // M2 Max MacBook Pro
            'P7Q',  // M3 MacBook Air
            'Q8R',  // M3 MacBook Pro
            'R9S'   // M3 Pro/Max MacBook Pro
        ] : [
            // Intel处理器序列号前缀
            'C02',  // 通用前缀
            'C17',  // Intel MacBook Pro
            'C07',  // Intel MacBook Air
            'F5K',  // Intel iMac
            'G5K'   // Intel Mac Pro
        ];

        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

        // 修复：确保生成正确的12字符长度序列号 (3字符前缀 + 9字符随机)
        // 使用更明确的字符集和长度控制
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let suffix = "";
        for (let i = 0; i < 9; i++) {
            suffix += chars[Math.floor(Math.random() * chars.length)];
        }

        const serial = prefix + suffix;

        // 验证长度确保为12位
        if (serial.length !== 12) {
            console.warn(`⚠️ Mac序列号长度异常: ${serial} (长度: ${serial.length})`);
            // 如果长度不对，重新生成一个标准的12位序列号
            return 'C02' + Array.from({length: 9}, () =>
                chars[Math.floor(Math.random() * chars.length)]
            ).join("");
        }

        return serial;
    },

    /**
     * 生成Windows GUID
     */
    generateWindowsGuid() {
        return "{" + [8,4,4,4,12].map(len =>
            Array.from({length: len}, () =>
                "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
            ).join("")
        ).join("-") + "}";
    },

    /**
     * 生成VSCode machineId格式（64位十六进制字符串）
     */
    generateMachineId() {
        return Array.from({length: 64}, () =>
            "0123456789abcdef"[Math.floor(Math.random() * 16)]
        ).join("");
    },

    /**
     * 生成Windows产品ID
     * 格式: 00330-91125-35784-AA503 (20个字符，全数字+固定AA)
     * 基于真实Windows ProductId格式
     */
    generateWindowsProductId() {
        // 第一组：5位数字 (产品相关编号)
        const firstGroup = Array.from({length: 5}, () =>
            "0123456789"[Math.floor(Math.random() * 10)]
        ).join("");

        // 第二组：5位数字 (随机序列号)
        const secondGroup = Array.from({length: 5}, () =>
            "0123456789"[Math.floor(Math.random() * 10)]
        ).join("");

        // 第三组：5位数字 (随机序列号)
        const thirdGroup = Array.from({length: 5}, () =>
            "0123456789"[Math.floor(Math.random() * 10)]
        ).join("");

        // 第四组：AA + 3位数字 (AA似乎是固定的)
        const fourthGroup = "AA" + Array.from({length: 3}, () =>
            "0123456789"[Math.floor(Math.random() * 10)]
        ).join("");

        return `${firstGroup}-${secondGroup}-${thirdGroup}-${fourthGroup}`;
    },

    /**
     * 生成平台特定信息（平台感知）
     * @param {string} realPlatform - 真实平台
     */
    generatePlatformSpecificInfo(realPlatform) {
        // 返回与真实平台相同的平台类型，但可能是假的具体版本
        return realPlatform;
    },

    /**
     * 生成架构特定信息（平台感知）
     * @param {string} realPlatform - 真实平台
     * @param {string} realArch - 真实架构
     */
    generateArchSpecificInfo(realPlatform, realArch) {
        // 保持真实架构类型以确保兼容性
        return realArch;
    },

    /**
     * 生成平台信息（已弃用，保留向后兼容）
     */
    generatePlatform() {
        const platforms = ['darwin', 'win32', 'linux'];
        return platforms[Math.floor(Math.random() * platforms.length)];
    },

    /**
     * 生成架构信息（已弃用，保留向后兼容）
     */
    generateArch() {
        const archs = ['x64', 'arm64'];
        return archs[Math.floor(Math.random() * archs.length)];
    },

    /**
     * 生成主机名（v2.5增强版 - 多样化格式）
     */
    generateHostname() {
        const prefixes = [
            'desktop', 'laptop', 'workstation', 'dev', 'user', 'admin', 'test',
            'build', 'server', 'client', 'node', 'host', 'machine', 'system',
            'office', 'home', 'work', 'studio', 'lab', 'prod', 'staging'
        ];
        const suffixes = [
            'pc', 'machine', 'host', 'system', 'box', 'rig', 'station',
            'node', 'device', 'unit', 'terminal', 'computer', 'workstation'
        ];
        const brands = [
            'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'apple', 'surface',
            'thinkpad', 'pavilion', 'inspiron', 'latitude', 'precision'
        ];
        const adjectives = [
            'fast', 'quick', 'smart', 'pro', 'elite', 'ultra', 'max', 'plus',
            'prime', 'core', 'edge', 'zen', 'nova', 'apex', 'flux', 'sync'
        ];

        // 生成多种主机名格式
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
                const number = Math.floor(Math.random() * 9999) + 1000;
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
                const number = Math.floor(Math.random() * 9999) + 1000;
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

        // 按权重随机选择格式
        const weights = [30, 20, 15, 15, 10, 5, 3, 2]; // 对应上面8种格式的权重
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
            case 'darwin':
                return 'Darwin';
            case 'win32':
                return 'Windows_NT';
            case 'linux':
                return 'Linux';
            default:
                return 'Linux';
        }
    },

    /**
     * 生成平台特定的OS版本（支持M系列架构感知）
     * @param {string} realPlatform - 真实平台
     */
    generateOSVersionForPlatform(realPlatform) {
        switch (realPlatform) {
            case 'darwin':
                // 获取真实架构来决定版本范围
                const realArch = process.arch;

                if (realArch === 'arm64') {
                    // M系列处理器支持的macOS版本 (Darwin kernel versions)
                    const mSeriesVersions = [
                        // macOS Big Sur (M1支持开始)
                        '20.6.0',  // macOS 11.6 Big Sur

                        // macOS Monterey (M1 Pro/Max支持)
                        '21.1.0',  // macOS 12.1 Monterey
                        '21.2.0',  // macOS 12.2 Monterey
                        '21.3.0',  // macOS 12.3 Monterey
                        '21.4.0',  // macOS 12.4 Monterey
                        '21.5.0',  // macOS 12.5 Monterey
                        '21.6.0',  // macOS 12.6 Monterey

                        // macOS Ventura (M2支持)
                        '22.1.0',  // macOS 13.1 Ventura
                        '22.2.0',  // macOS 13.2 Ventura
                        '22.3.0',  // macOS 13.3 Ventura
                        '22.4.0',  // macOS 13.4 Ventura
                        '22.5.0',  // macOS 13.5 Ventura
                        '22.6.0',  // macOS 13.6 Ventura

                        // macOS Sonoma (M3支持)
                        '23.0.0',  // macOS 14.0 Sonoma
                        '23.1.0',  // macOS 14.1 Sonoma
                        '23.2.0',  // macOS 14.2 Sonoma
                        '23.3.0',  // macOS 14.3 Sonoma
                        '23.4.0',  // macOS 14.4 Sonoma
                        '23.5.0',  // macOS 14.5 Sonoma
                        '23.6.0',  // macOS 14.6 Sonoma

                        // macOS Sequoia (M4支持)
                        '24.0.0',  // macOS 15.0 Sequoia
                        '24.1.0',  // macOS 15.1 Sequoia
                        '24.2.0'   // macOS 15.2 Sequoia
                    ];
                    return mSeriesVersions[Math.floor(Math.random() * mSeriesVersions.length)];
                } else {
                    // Intel处理器支持的macOS版本 (包含更早的版本)
                    const intelVersions = [
                        // macOS Catalina (Intel支持)
                        '19.6.0',  // macOS 10.15.7 Catalina

                        // macOS Big Sur (Intel支持)
                        '20.1.0',  // macOS 11.1 Big Sur
                        '20.2.0',  // macOS 11.2 Big Sur
                        '20.3.0',  // macOS 11.3 Big Sur
                        '20.4.0',  // macOS 11.4 Big Sur
                        '20.5.0',  // macOS 11.5 Big Sur
                        '20.6.0',  // macOS 11.6 Big Sur

                        // macOS Monterey (Intel支持)
                        '21.1.0',  // macOS 12.1 Monterey
                        '21.2.0',  // macOS 12.2 Monterey
                        '21.3.0',  // macOS 12.3 Monterey
                        '21.4.0',  // macOS 12.4 Monterey
                        '21.5.0',  // macOS 12.5 Monterey
                        '21.6.0',  // macOS 12.6 Monterey

                        // macOS Ventura (Intel支持)
                        '22.1.0',  // macOS 13.1 Ventura
                        '22.2.0',  // macOS 13.2 Ventura
                        '22.3.0',  // macOS 13.3 Ventura
                        '22.4.0',  // macOS 13.4 Ventura
                        '22.5.0',  // macOS 13.5 Ventura
                        '22.6.0',  // macOS 13.6 Ventura

                        // macOS Sonoma (Intel支持)
                        '23.0.0',  // macOS 14.0 Sonoma
                        '23.1.0',  // macOS 14.1 Sonoma
                        '23.2.0',  // macOS 14.2 Sonoma
                        '23.3.0',  // macOS 14.3 Sonoma
                        '23.4.0',  // macOS 14.4 Sonoma
                        '23.5.0',  // macOS 14.5 Sonoma
                        '23.6.0'   // macOS 14.6 Sonoma (Intel最后支持版本)
                    ];
                    return intelVersions[Math.floor(Math.random() * intelVersions.length)];
                }

            case 'win32':
                // Windows版本
                const winVersions = [
                    '10.0.19041',  // Windows 10 20H1
                    '10.0.19042',  // Windows 10 20H2
                    '10.0.19043',  // Windows 10 21H1
                    '10.0.19044',  // Windows 10 21H2
                    '10.0.22000',  // Windows 11 21H2
                    '10.0.22621',  // Windows 11 22H2
                    '10.0.22631'   // Windows 11 23H2
                ];
                return winVersions[Math.floor(Math.random() * winVersions.length)];

            case 'linux':
            default:
                // Linux内核版本
                const linuxVersions = [
                    '5.15.0',
                    '5.19.0',
                    '6.1.0',
                    '6.2.0',
                    '6.5.0',
                    '6.8.0'
                ];
                return linuxVersions[Math.floor(Math.random() * linuxVersions.length)];
        }
    },

    /**
     * 生成操作系统类型（已弃用，保留向后兼容）
     */
    generateOSType() {
        const types = ['Darwin', 'Windows_NT', 'Linux'];
        return types[Math.floor(Math.random() * types.length)];
    },

    /**
     * 生成操作系统版本（已弃用，保留向后兼容）
     */
    generateOSVersion() {
        const versions = [
            '22.6.0', '23.1.0', '23.2.0', '23.3.0', '23.4.0',
            '10.0.22621', '10.0.22631', '6.2.0', '6.5.0'
        ];
        return versions[Math.floor(Math.random() * versions.length)];
    },

    /**
     * 生成VSCode版本
     */
    generateVSCodeVersion() {
        return INTERCEPTOR_CONFIG.vscode.versions[
            Math.floor(Math.random() * INTERCEPTOR_CONFIG.vscode.versions.length)
        ];
    },

    /**
     * 生成假的macOS主板ID（随机16位十六进制）
     */
    generateMacBoardId() {
        // 生成完全随机的16位十六进制主板ID
        // 格式: Mac-XXXXXXXXXXXXXXXX (16位十六进制)
        const randomHex = Array.from({length: 16}, () =>
            "0123456789ABCDEF"[Math.floor(16 * Math.random())]
        ).join("");

        return `Mac-${randomHex}`;
    },

    /**
     * 生成假的Mac型号（基于真实架构）
     */
    generateMacModel() {
        // 获取真实架构来决定型号
        const realArch = process.arch;

        // 根据架构选择合适的Mac型号
        const models = realArch === 'arm64' ? [
            // M系列Mac型号
            'MacBookAir10,1',    // M1 MacBook Air
            'MacBookPro17,1',    // M1 MacBook Pro 13"
            'MacBookPro18,1',    // M1 Pro MacBook Pro 14"
            'MacBookPro18,2',    // M1 Pro MacBook Pro 16"
            'MacBookPro18,3',    // M1 Max MacBook Pro 14"
            'MacBookPro18,4',    // M1 Max MacBook Pro 16"
            'MacBookAir15,2',    // M2 MacBook Air
            'MacBookPro19,1',    // M2 MacBook Pro 13"
            'MacBookPro19,3',    // M2 Pro MacBook Pro 14"
            'MacBookPro19,4',    // M2 Pro MacBook Pro 16"
            'MacBookPro20,1',    // M2 Max MacBook Pro 14"
            'MacBookPro20,2',    // M2 Max MacBook Pro 16"
            'iMac21,1',          // M1 iMac 24"
            'iMac21,2',          // M1 iMac 24"
            'Macmini9,1',        // M1 Mac mini
            'MacStudio10,1',     // M1 Max Mac Studio
            'MacStudio10,2'      // M1 Ultra Mac Studio
        ] : [
            // Intel Mac型号
            'MacBookPro15,1',    // Intel MacBook Pro 15" 2018-2019
            'MacBookPro15,2',    // Intel MacBook Pro 13" 2018-2019
            'MacBookPro15,3',    // Intel MacBook Pro 15" 2019
            'MacBookPro15,4',    // Intel MacBook Pro 13" 2019
            'MacBookPro16,1',    // Intel MacBook Pro 16" 2019-2020
            'MacBookPro16,2',    // Intel MacBook Pro 13" 2020
            'MacBookPro16,3',    // Intel MacBook Pro 13" 2020
            'MacBookPro16,4',    // Intel MacBook Pro 16" 2020
            'MacBookAir8,1',     // Intel MacBook Air 2018
            'MacBookAir8,2',     // Intel MacBook Air 2019
            'MacBookAir9,1',     // Intel MacBook Air 2020
            'iMac19,1',          // Intel iMac 27" 2019
            'iMac19,2',          // Intel iMac 21.5" 2019
            'iMac20,1',          // Intel iMac 27" 2020
            'iMac20,2',          // Intel iMac 27" 2020
            'Macmini8,1',        // Intel Mac mini 2018
            'iMacPro1,1'         // Intel iMac Pro 2017
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
        // 随机选择8位或10位格式 (8位更常见)
        const length = Math.random() < 0.7 ? 8 : 10;
        return Array.from({length}, () => chars[Math.floor(36 * Math.random())]).join("");
    },

    /**
     * 生成假的IOPlatform UUID（用于ioreg输出伪造）
     */
    generateFakeIOPlatformUUID() {
        return [8, 4, 4, 4, 12].map(length =>
            Array.from({length}, () => "0123456789ABCDEF"[Math.floor(16 * Math.random())]).join("")
        ).join("-");
    },

    /**
     * 生成假的IOPlatform序列号（用于ioreg输出伪造）
     * 修复：生成正确的12字符长度序列号
     */
    generateFakeIOPlatformSerial() {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return "C02" + Array.from({length: 9}, () => chars[Math.floor(36 * Math.random())]).join("");
    },

    /**
     * 生成Linux机器ID
     */
    generateLinuxMachineId() {
        // 生成类似 /etc/machine-id 的32位十六进制字符串
        return Array.from({length: 32}, () =>
            "0123456789abcdef"[Math.floor(16 * Math.random())]
        ).join("");
    }
};
