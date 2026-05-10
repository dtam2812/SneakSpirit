const { buildContext } = require("../ContextBuilder");
const { buildRAGPrompt, buildQueryExpansionPrompt } = require("./RAGPrompt");
const { getSystemPrompt } = require("../prompts/SystemPrompt");
const AiService = require("../../Services/AiService");

const ENABLE_QUERY_EXPANSION = false;

const processQuery = async (
  userMessage,
  conversationHistory = [],
  options = {},
) => {
  try {
    let searchQuery = userMessage;

    if (ENABLE_QUERY_EXPANSION) {
      try {
        const expansionPrompt = buildQueryExpansionPrompt(userMessage);
        const expansionRaw = await AiService.complete(expansionPrompt, {
          maxTokens: 200,
          temperature: 0,
        });
        const expansion = JSON.parse(expansionRaw);
        searchQuery = expansion.expandedQuery || userMessage;
        console.log(searchQuery);
      } catch {
        searchQuery = userMessage;
      }
    }

    const { chunks, isEmpty, summary } = await buildContext(
      searchQuery,
      options,
    );

    console.log(`[RAGEngine] ${summary}`);

    const systemPrompt = getSystemPrompt();
    const userPrompt = buildRAGPrompt(chunks, userMessage, conversationHistory);

    const answer = await AiService.chat({
      system: systemPrompt,
      messages: [...conversationHistory, { role: "user", content: userPrompt }],
    });

    return {
      answer,
      context: chunks,
      debug: {
        searchQuery,
        contextFound: !isEmpty,
        chunkCount: chunks.length,
      },
    };
  } catch (error) {
    console.error(error.message);
    throw new Error("Đã xảy ra lỗi khi xử lý câu hỏi. Vui lòng thử lại.");
  }
};

module.exports = { processQuery };
