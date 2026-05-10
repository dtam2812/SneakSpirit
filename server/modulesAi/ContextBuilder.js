const EmbeddingService = require("../Services/EmbeddingService");
const VectorStoreService = require("../Services/VectorStoreService");

const MAX_CONTEXT_CHUNKS = 5;
const MIN_SIMILARITY_SCORE = 0.65;

const retrieveRelevantChunks = async (userQuery, options = {}) => {
  try {
    // 1. Embed câu hỏi của user thành vector
    const queryVector = await EmbeddingService.embedText(userQuery);

    // 2. Tìm các chunks tương tự trong vector store
    const rawChunks = await VectorStoreService.similaritySearch(queryVector, {
      topK: MAX_CONTEXT_CHUNKS + 3, // Lấy dư để lọc sau
      filter: options.filter || {},
    });

    // 3. Lọc theo ngưỡng similarity
    const filteredChunks = rawChunks.filter(
      (chunk) => chunk.score >= MIN_SIMILARITY_SCORE,
    );

    // 4. Giới hạn số lượng chunks
    const topChunks = filteredChunks.slice(0, MAX_CONTEXT_CHUNKS);

    // 5. Loại bỏ duplicate nội dung
    const dedupedChunks = deduplicateChunks(topChunks);

    return dedupedChunks;
  } catch (error) {
    console.error("[ContextBuilder] Error retrieving chunks:", error.message);
    return [];
  }
};

const deduplicateChunks = (chunks) => {
  const seen = new Set();
  return chunks.filter((chunk) => {
    // Dùng 50 ký tự đầu làm key để detect duplicate
    const key = chunk.text?.substring(0, 50).trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const buildContext = async (userQuery, options = {}) => {
  const chunks = await retrieveRelevantChunks(userQuery, options);

  return {
    chunks,
    isEmpty: chunks.length === 0,
    summary:
      chunks.length > 0
        ? `Tìm thấy ${chunks.length} thông tin liên quan`
        : "Không tìm thấy thông tin liên quan",
  };
};

module.exports = { buildContext, retrieveRelevantChunks };
