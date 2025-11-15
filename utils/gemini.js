import { GoogleGenAI } from "@google/genai";
import zodToJsonSchema from "zod-to-json-schema";
var __api_key = null;
var __client = null;

export async function load_api_key() {
    return new Promise((resolve, reject) => {
        console.log("ストレージからAPIキーの取得を開始...");

        chrome.storage.local.get({ llmApiKey: "" }, (items) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return reject(chrome.runtime.lastError);
            }

            __api_key = items.llmApiKey;

            console.log("キーの取得完了:", __api_key ? "キーあり" : "キーがありません");

            resolve();
        });
    });
}

export async function chat_completion(prompt, response_schema = null) {
    if (!__api_key) {
        await load_api_key();
    }
    if (!__client) {
        __client = new GoogleGenAI({ apiKey: __api_key });
    }
    const response = await __client.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: response_schema ? zodToJsonSchema(response_schema) : null
        }
    });
    return response.text;
}
