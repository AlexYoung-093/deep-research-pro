import { NextRequest } from "next/server";

/**
 * SSE 流式 API Route
 * 代理 Dify Workflow API 的流式响应
 *
 * POST /api/research/stream
 */

const DIFY_API_URL = process.env.DIFY_API_URL || "https://dify-dev.xtalpi.xyz/v1/workflows/run";
const DIFY_API_KEY = process.env.DIFY_API_KEY || "app-jhoF6qA8f8ATengXDp6v8vuj";

// 调试：打印配置信息
console.log("[Dify API] URL:", DIFY_API_URL);
console.log("[Dify API] Key configured:", DIFY_API_KEY ? "Yes (length: " + DIFY_API_KEY.length + ")" : "No");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inputs } = body;

    // 验证输入
    if (!inputs?.research_topic) {
      return new Response(
        JSON.stringify({ error: "缺少研究主题" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 验证 API Key
    if (!DIFY_API_KEY) {
      const errorEvent = {
        event: "error",
        data: { error: "API Key 未配置" },
      };
      return new Response(`data: ${JSON.stringify(errorEvent)}\n\n`, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
        },
      });
    }

    // 创建可读流
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // 调试：打印请求信息
          const authHeader = `Bearer ${DIFY_API_KEY}`;
          console.log("[Dify API] 发送请求...");
          console.log("[Dify API] URL:", DIFY_API_URL);
          console.log("[Dify API] Auth Header:", authHeader);
          console.log("[Dify API] Full API Key:", DIFY_API_KEY);
          
          // 调用 Dify Workflow API
          const requestHeaders = {
            "Authorization": authHeader,
            "Content-Type": "application/json",
          };
          console.log("[Dify API] Request Headers:", JSON.stringify(requestHeaders));
          
          const response = await fetch(DIFY_API_URL, {
            method: "POST",
            headers: requestHeaders,
            body: JSON.stringify({
              inputs: {
                research_topic: inputs.research_topic,
                report_type: inputs.report_type || "行业研报",
                depth_level: inputs.depth_level || "深度研究",
                word_count: inputs.word_count || "3000字",
              },
              response_mode: "streaming",
              user: `web-user-${Date.now()}`,
            }),
          });

          // 检查响应状态
          if (!response.ok) {
            const errorText = await response.text();
            const errorEvent = {
              event: "error",
              data: {
                error: `Dify API 错误: ${response.status} - ${errorText}`,
              },
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`)
            );
            controller.close();
            return;
          }

          // 获取响应体读取器
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error("无法获取响应流");
          }

          // 透传 Dify 的 SSE 数据
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }

          controller.close();
        } catch (error) {
          console.error("SSE 流处理错误:", error);
          const errorEvent = {
            event: "error",
            data: {
              error: error instanceof Error ? error.message : "未知错误",
            },
          };
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(errorEvent)}\n\n`)
          );
          controller.close();
        }
      },
    });

    // 返回 SSE 响应
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // 禁用 Nginx 缓冲
      },
    });
  } catch (error) {
    console.error("API Route 错误:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "服务器内部错误",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// 配置路由选项
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

