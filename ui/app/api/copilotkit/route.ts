import { NextRequest } from "next/server";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";
import path from 'path';
import * as dotenv from 'dotenv';

// Load .env file from parent directory
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Helper function to validate environment variables
const validateEnv = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY - Please ensure your .env file is in the project root (parent directory of ui/) and contains this variable');
  }
  
  return {
    openaiApiKey: process.env.OPENAI_API_KEY,
    remoteActionUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    environment: process.env.NODE_ENV || 'development'
  };
};

// Get validated environment variables
const env = validateEnv();

const openai = new OpenAI({
  apiKey: env.openaiApiKey
});
const serviceAdapter = new OpenAIAdapter({ openai });

const runtime = new CopilotRuntime({
  remoteActions: [
    {
      url: env.remoteActionUrl + "/copilotkit",
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
        environment: env.environment,
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
