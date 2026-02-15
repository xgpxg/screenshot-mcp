import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    Tool,
} from '@modelcontextprotocol/sdk/types.js';
import {ScreenshotApiClient} from './client.js';
import {ScreenshotRequest} from './types.js';

/**
 * 截图MCP服务器类
 */
class ScreenshotMcpServer {
    private server: Server;
    private client: ScreenshotApiClient | null = null;

    constructor() {
        this.server = new Server(
            {
                name: 'screenshot-mcp',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
    }

    /**
     * 设置MCP处理器
     */
    private setupHandlers(): void {
        // 工具列表处理器
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'take_screenshot',
                        description: '生成指定URL的网页截图',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                url: {
                                    type: 'string',
                                    description: '要截图的网页链接'
                                },
                                width: {
                                    type: 'number',
                                    description: '截图宽度，默认1920',
                                    minimum: 1
                                },
                                height: {
                                    type: 'number',
                                    description: '截图高度，默认1080',
                                    minimum: 1
                                },
                                waitSeconds: {
                                    type: 'number',
                                    description: '等待网页加载的秒数(0-3)',
                                    minimum: 0,
                                    maximum: 3
                                },
                                device: {
                                    type: 'string',
                                    description: '设备类型: mobile, pc',
                                    enum: ['mobile', 'pc']
                                },
                                fullscreen: {
                                    type: 'boolean',
                                    description: '是否全屏截图'
                                },
                                withShell: {
                                    type: 'string',
                                    description: '带壳截图的设备模板',
                                    enum: ['iPhone 14 Pro', 'iPhone X', 'iPhone 8 Plus', 'iPad', 'MacBook Pro']
                                },
                                clarity: {
                                    type: 'number',
                                    description: '清晰度(1-3)，仅对移动设备有效',
                                    minimum: 1,
                                    maximum: 3
                                }
                            },
                            required: ['url']
                        }
                    },

                ]
            };
        });

        // 工具调用处理器
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const {name, arguments: args} = request.params;

            switch (name) {
                case 'take_screenshot':
                    // 类型安全的转换：确保args存在且包含必需的url字段
                    if (!args || typeof args !== 'object' || !('url' in args) || typeof args.url !== 'string') {
                        throw new Error('缺少必需的url参数');
                    }
                    // @ts-ignore
                    return await this.handleTakeScreenshot(args as ScreenshotRequest);


                default:
                    throw new Error(`未知工具: ${name}`);
            }
        });
    }

    /**
     * 处理截图请求
     */
    private async handleTakeScreenshot(params: ScreenshotRequest) {
        // 运行时参数验证
        if (!params.url || typeof params.url !== 'string') {
            throw new Error('URL参数是必需的字符串');
        }

        if (params.width !== undefined && (typeof params.width !== 'number' || params.width <= 0)) {
            throw new Error('width必须是正数');
        }

        if (params.height !== undefined && (typeof params.height !== 'number' || params.height <= 0)) {
            throw new Error('height必须是正数');
        }

        if (params.waitSeconds !== undefined && (typeof params.waitSeconds !== 'number' || params.waitSeconds < 0 || params.waitSeconds > 3)) {
            throw new Error('waitSeconds必须在0-3之间');
        }

        if (params.clarity !== undefined && (typeof params.clarity !== 'number' || params.clarity < 1 || params.clarity > 3)) {
            throw new Error('clarity必须在1-3之间');
        }
        if (!this.client) {
            return {
                content: [{
                    type: 'text',
                    text: '错误: 请先设置ACCESS_TOKEN环境变量。'
                }]
            };
        }

        try {
            const imageUrl = await this.client.takeScreenshot(params);

            return {
                content: [{
                    type: 'text',
                    text: `截图生成成功！\n图片URL: ${imageUrl}\n\n。`
                }]
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            return {
                content: [{
                    type: 'text',
                    text: `截图生成失败: ${errorMessage}`
                }]
            };
        }
    }


    /**
     * 初始化客户端
     */
    public initializeClient(accessToken: string): void {
        this.client = new ScreenshotApiClient({accessToken});
    }

    /**
     * 启动服务器
     */
    public async run(): Promise<void> {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
    }
}

// 主函数
async function main() {
    const accessToken = process.env.ACCESS_TOKEN;

    if (!accessToken) {
        console.error('错误: 请设置ACCESS_TOKEN环境变量');
        console.error('使用方法: ACCESS_TOKEN=your_token npx screenshot-mcp');
        process.exit(1);
    }

    const server = new ScreenshotMcpServer();
    server.initializeClient(accessToken);

    try {
        await server.run();
    } catch (error) {
        console.error('服务器运行错误:', error);
        process.exit(1);
    }
}

import {pathToFileURL} from 'url';
// 如果直接运行此文件，则启动服务器
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch(console.error);
}

export {ScreenshotMcpServer};