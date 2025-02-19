import { createErrorResponse, PluginErrorType } from '@lobehub/chat-plugin-sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();

  if (!data.query || !data.baseurl) {
    return createErrorResponse(PluginErrorType.InvalidParams, '缺少必要的参数');
  }

  const { query, baseurl } = data;

  try {
    // 构造 SearXNG 搜索请求
    const searchUrl = `${baseurl}/search?q=${encodeURIComponent(query)}&format=json`;
    const response = await fetch(searchUrl);

    if (!response.ok) {
      return createErrorResponse(PluginErrorType.RemoteServiceError, `SearXNG 服务返回错误：${response.status}`);
    }

    const searchResults = await response.json();
    return NextResponse.json({ results: searchResults.results });
  } catch (error) {
    console.error('SearXNG 搜索失败：', error);
    return createErrorResponse(PluginErrorType.RemoteServiceError, 'SearXNG 搜索失败');
  }
}
