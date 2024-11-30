import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

const openai = new OpenAI();
const serviceAdapter = new OpenAIAdapter({ openai });

const runtime = new CopilotRuntime({
  remoteActions: [
    {
      url: process.env.REMOTE_ACTION_URL || "http://localhost:8002/copilotkit",
      onBeforeRequest: ({ ctx }) => ({
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 300000,
      })
    },
  ],
  middleware: {
    onBeforeRequest: async (options) => {
      console.log('Processing request for thread:', options.threadId);
    },
    onAfterRequest: async (options) => {
      console.log('Completed request for thread:', options.threadId);
    },
  }
});

export const POST = async (req: NextRequest) => {
  try {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
      runtime,
      serviceAdapter,
      endpoint: "/api/copilotkit",
      properties: {
        environment: process.env.NODE_ENV,
        apiVersion: '1.0'
      }
    });

    return handleRequest(req);
  } catch (error) {
    console.error('Error in copilotkit endpoint:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
};
