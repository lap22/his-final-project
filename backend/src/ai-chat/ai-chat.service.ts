// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// // 1. Import class GoogleGenAI từ package mới chính xác
// import { GoogleGenAI } from '@google/genai';

// @Injectable()
// export class AiChatService {
//   private ai: GoogleGenAI;

//   constructor() {
//     const apiKey = process.env.GEMINI_API_KEY || '';
//     if (!apiKey) {
//       throw new InternalServerErrorException(
//         'Chưa cấu hình GEMINI_API_KEY trong file .env',
//       );
//     }

//     // 2. Khởi tạo SDK theo chuẩn mới
//     this.ai = new GoogleGenAI({ apiKey: apiKey });
//   }

//   async analyzeSymptoms(
//     userSymptoms: string,
//   ): Promise<Record<string, unknown>> {
//     const prompt = `
//       Bạn là một trợ lý y tế AI. Bệnh nhân cung cấp triệu chứng: "${userSymptoms}".
//       Hãy phân tích và trả về một chuỗi JSON duy nhất theo cấu trúc:
//       {
//         "aiAnalysis": "Lời khuyên sơ bộ bằng tiếng Việt",
//         "aiSummary": "Tóm tắt triệu chứng ngắn gọn cho bác sĩ",
//         "suggestedDept": "Khoa phù hợp (Ví dụ: Khoa Nội tổng quát, Khoa Nhi, Khoa Da liễu...)"
//       }
//     `;

//     try {
//       // 3. Sử dụng cú pháp mới: ai.models.generateContent (vô cùng gọn gàng)
//       const response = await this.ai.models.generateContent({
//         model: 'gemini-1.5-flash',
//         contents: prompt,
//         config: { responseMimeType: 'application/json' }, // Ép AI nhả JSON sạch
//       });

//       const responseText = response.text;
//       if (!responseText) {
//         throw new Error('AI không phản hồi dữ liệu');
//       }

//       return JSON.parse(responseText) as Record<string, unknown>;
//     } catch (error) {
//       console.error('Gemini API Error:', error);
//       throw new InternalServerErrorException(
//         'Không thể kết nối với trí tuệ nhân tạo lúc này.',
//       );
//     }
//   }
// }
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai'; // Đảm bảo dùng đúng thư viện mới nhất

@Injectable()
export class AiChatService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'Chưa cấu hình GEMINI_API_KEY trong file .env',
      );
    }
    // Khởi tạo instance chuẩn theo tài liệu Google
    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async analyzeSymptoms(symptoms: string) {
    try {
      // Sử dụng model nòng cốt hiện tại là gemini-2.5-flash
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Bạn là một bác sĩ chuyên nghiệp. Hãy phân tích các triệu chứng sau và đưa ra lời khuyên sơ bộ: ${symptoms}`,
      });

      return {
        success: true,
        result: response.text,
      };
    } catch (error) {
      // TẠM THỜI: In lỗi thực tế ra Terminal để xem Google đang báo gì (Bị block IP, sai Key, hay lỗi model)
      console.error('=== LỖI THỰC TẾ TỪ GOOGLE ===:', error);

      throw new InternalServerErrorException(
        'Không thể kết nối với trí tuệ nhân tạo lúc này.',
      );
    }
  }
}
