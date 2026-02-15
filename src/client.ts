import axios, { AxiosInstance } from 'axios';
import { ScreenshotRequest, ScreenshotResponse, ApiConfig } from './types';

/**
 * 截图API客户端类
 */
export class ScreenshotApiClient {
  private client: AxiosInstance;
  private baseUrl: string;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl || 'https://oneapi.coderbox.cn/openapi/api/webpage/screenshot/v2';
    
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000, // 30秒超时
      headers: {
        'Content-Type': 'application/json',
        'AccessToken': config.accessToken
      }
    });

    // 添加响应拦截器处理错误
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          // 服务器返回错误状态码
          throw new Error(`API Error: ${error.response.status} - ${error.response.data?.msg || error.message}`);
        } else if (error.request) {
          // 请求发出但没有收到响应
          throw new Error(`Network Error: ${error.message}`);
        } else {
          // 其他错误
          throw new Error(`Request Error: ${error.message}`);
        }
      }
    );
  }

  /**
   * 生成网页截图
   * @param params 截图参数
   * @returns 截图图片URL
   */
  async takeScreenshot(params: ScreenshotRequest): Promise<string> {
    try {
      // 参数验证
      if (!params.url) {
        throw new Error('URL参数是必需的');
      }

      if (params.waitSeconds !== undefined && (params.waitSeconds < 0 || params.waitSeconds > 3)) {
        throw new Error('waitSeconds参数必须在0-3之间');
      }

      if (params.clarity !== undefined && (params.clarity < 1 || params.clarity > 3)) {
        throw new Error('clarity参数必须在1-3之间');
      }

      if (params.withShell && (params.width || params.height)) {
        throw new Error('使用带壳截图时不能设置width和height参数');
      }

      const response = await this.client.post<ScreenshotResponse>('', params);
      
      if (response.data.code !== 0) {
        throw new Error(`API返回错误: ${response.data.msg || '未知错误'}`);
      }

      return response.data.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('截图请求失败');
    }
  }


}