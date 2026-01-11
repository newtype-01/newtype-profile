/**
 * OpenAI → Gemini message format converter
 *
 * Converts OpenAI-style messages to Gemini contents format,
 * injecting thoughtSignature into functionCall parts.
 */
interface OpenAIMessage {
    role: "system" | "user" | "assistant" | "tool";
    content?: string | OpenAIContentPart[];
    tool_calls?: OpenAIToolCall[];
    tool_call_id?: string;
    name?: string;
}
interface OpenAIContentPart {
    type: string;
    text?: string;
    image_url?: {
        url: string;
    };
    [key: string]: unknown;
}
interface OpenAIToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}
interface GeminiPart {
    text?: string;
    functionCall?: {
        name: string;
        args: Record<string, unknown>;
    };
    functionResponse?: {
        name: string;
        response: Record<string, unknown>;
    };
    inlineData?: {
        mimeType: string;
        data: string;
    };
    thought_signature?: string;
    [key: string]: unknown;
}
interface GeminiContent {
    role: "user" | "model";
    parts: GeminiPart[];
}
export declare function convertOpenAIToGemini(messages: OpenAIMessage[], thoughtSignature?: string): GeminiContent[];
export declare function hasOpenAIMessages(body: Record<string, unknown>): boolean;
export declare function convertRequestBody(body: Record<string, unknown>, thoughtSignature?: string): Record<string, unknown>;
export {};
