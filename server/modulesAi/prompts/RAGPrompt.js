const buildRAGPrompt = (context, userQuestion, conversationHistory = []) => {
  const contextBlock =
    context && context.length > 0
      ? `## THÔNG TIN THAM KHẢO TỪ CỬA HÀNG
${context.map((chunk, i) => `[${i + 1}] ${chunk.text}`).join("\n\n")}
`
      : `## THÔNG TIN THAM KHẢO
Không tìm thấy thông tin liên quan trong cơ sở dữ liệu.
`;

  const historyBlock =
    conversationHistory.length > 0
      ? `## LỊCH SỬ HỘI THOẠI
${conversationHistory
  .slice(-6)
  .map(
    (msg) => `${msg.role === "user" ? "Khách hàng" : "Trợ lý"}: ${msg.content}`,
  )
  .join("\n")}
`
      : "";

  return `${contextBlock}
${historyBlock}
## CÂU HỎI HIỆN TẠI CỦA KHÁCH HÀNG
${userQuestion}

## YÊU CẦU
Dựa vào thông tin tham khảo ở trên, hãy trả lời câu hỏi của khách hàng một cách chính xác và hữu ích. 
Nếu thông tin tham khảo không đủ để trả lời, hãy thành thật nói với khách hàng.
`;
};

const buildQueryExpansionPrompt = (userQuestion) => {
  return `Bạn là hệ thống phân tích câu hỏi cho cửa hàng giày. 
Hãy phân tích câu hỏi sau và trích xuất các từ khóa tìm kiếm quan trọng.

Câu hỏi: "${userQuestion}"

Trả về JSON với format:
{
  "keywords": ["từ khóa 1", "từ khóa 2", ...],
  "intent": "product_search | order_inquiry | policy | promotion | general",
  "expandedQuery": "câu truy vấn mở rộng để tìm kiếm hiệu quả hơn"
}

Chỉ trả về JSON, không giải thích thêm.`;
};

module.exports = { buildRAGPrompt, buildQueryExpansionPrompt };
