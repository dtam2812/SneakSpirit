const embeddingCache = new Map();
const MAX_CACHE_SIZE = 500;
const VECTOR_DIMENSION = 1024;

const embedText = async (text, taskType = "RETRIEVAL_QUERY", retries = 3) => {
  const cacheKey = `${taskType}::${text}`;
  if (embeddingCache.has(cacheKey)) return embeddingCache.get(cacheKey);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.jina.ai/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        },
        body: JSON.stringify({
          model: "jina-embeddings-v3",
          input: [text],
          task:
            taskType === "RETRIEVAL_QUERY"
              ? "retrieval.query"
              : "retrieval.passage",
        }),
      });

      const result = await response.json();
      const vector = result.data[0].embedding;

      if (embeddingCache.size >= MAX_CACHE_SIZE) {
        embeddingCache.delete(embeddingCache.keys().next().value);
      }
      embeddingCache.set(cacheKey, vector);
      return vector;
    } catch (error) {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, attempt * 3000));
      } else throw error;
    }
  }
};

const embedBatch = async (texts) => {
  const results = [];
  for (const text of texts) {
    const vector = await embedText(text, "RETRIEVAL_DOCUMENT");
    results.push(vector);
    await new Promise((r) => setTimeout(r, 100));
  }
  return results;
};

module.exports = { embedText, embedBatch, VECTOR_DIMENSION };
