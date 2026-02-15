/**
 * 截图API请求参数类型
 */
export interface ScreenshotRequest {
  /** 要截图的网页链接 (必需) */
  url: string;
  /** 截图宽度，默认1920 */
  width?: number;
  /** 截图高度，默认1080 */
  height?: number;
  /** 等待网页加载的秒数，取值范围[0,3] */
  waitSeconds?: number;
  /** 设备类型：mobile, pc */
  device?: 'mobile' | 'pc';
  /** 是否全屏截图 */
  fullscreen?: boolean;
  /** 带壳截图的设备模板 */
  withShell?: 'iPhone 14 Pro' | 'iPhone X' | 'iPhone 8 Plus' | 'iPad' | 'MacBook Pro';
  /** 清晰度，仅对移动设备有效，取值1-3 */
  clarity?: number;
}

/**
 * 截图API响应类型
 */
export interface ScreenshotResponse {
  /** 状态码，0表示成功 */
  code: number;
  /** 截图图片地址 */
  data: string;
  /** 错误信息 */
  msg: string;
  /** 时间戳 */
  timestamp: number;
}

/**
 * API客户端配置
 */
export interface ApiConfig {
  /** AccessToken认证令牌 */
  accessToken: string;
  /** API基础URL */
  baseUrl?: string;
}