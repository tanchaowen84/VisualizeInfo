import { GoogleGenAI, Type } from "@google/genai";
import { SurveyEntry } from "./types";

const processSurveyData = async (rawData: string): Promise<SurveyEntry[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found. Returning empty array.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    你是一个专业的数据分析师。
    
    输入文本是一个Web3信息获取渠道的调查接龙。
    格式通常是：“编号. 名字 渠道1，渠道2...”。
    
    任务：
    1. 解析文本。
    2. 提取每条记录的名字 (name)。
    3. 提取他们的信息渠道 (channels)。
    
    **关键规则 (至关重要)**：
    1. **区分具体与通用**：
       - 如果用户提到了具体的App名字（例如 "Foresightnews", "律动", "金色财经"），请直接提取该具体名字。
       - 如果用户只说了通用的 "新闻App", "App", "资讯APP", "财经app"，请统一归类为 **"新闻APP"**。
       
    2. **合并同义词**：请严格将以下变体统一为标准中文名称：
       - "推特", "X", "Twitter", "x", "Tw" -> "推特/X"
       - "TG", "tg", "Telegram", "电报" -> "Telegram/电报"
       - "微信", "vx", "WeChat", "wechat", "微信群" -> "微信"
       - "Discord", "dc", "DIS" -> "Discord"
       - "新闻App", "新闻APP", "news app", "App", "app", "资讯App", "财经app" -> "新闻APP"
       - "AI", "问AI", "ai" -> "AI"

    3. **保留细节**：对于 "公众号", "视频号", "朋友", "线下", "Medium" 等，按原文意图提取。
    
    4. **语言**：输出的渠道名称请使用中文（Discord, AI等通用英文词除外）。
    
    输入数据:
    ${rawData}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              originalText: { type: Type.STRING },
              name: { type: Type.STRING },
              channels: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["id", "name", "channels"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText) as SurveyEntry[];
    return parsed;
  } catch (error) {
    console.error("Error analyzing data with Gemini:", error);
    throw error;
  }
};

export { processSurveyData };
