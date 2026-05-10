const { processQuery } = require("../modulesAi/prompts/RAGEngine");

const conversationStore = new Map();
const MAX_HISTORY_LENGTH = 20; // Số tin nhắn tối đa lưu mỗi session
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 phút

const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Tin nhắn không được để trống",
      });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Tin nhắn quá dài (tối đa 1000 ký tự)",
      });
    }

    const sid = sessionId || `guest_${Date.now()}`;
    const session = getOrCreateSession(sid);

    const { answer, context, debug } = await processQuery(
      message.trim(),
      session.history,
      { sessionId: sid, userId: req.user?.id },
    );

    //Cập nhật lịch sử
    addToHistory(sid, "user", message.trim());
    addToHistory(sid, "assistant", answer);

    return res.status(200).json({
      success: true,
      data: {
        answer,
        sessionId: sid,
        ...(process.env.NODE_ENV === "development" && { debug }),
      },
    });
  } catch (error) {
    console.error("[chatController] Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Hệ thống đang gặp sự cố, vui lòng thử lại sau",
    });
  }
};

const clearSession = (req, res) => {
  const { sessionId } = req.params;

  if (conversationStore.has(sessionId)) {
    conversationStore.delete(sessionId);
    return res.status(200).json({
      success: true,
      message: "Đã xóa lịch sử hội thoại",
    });
  }

  return res.status(404).json({
    success: false,
    error: "Không tìm thấy session",
  });
};

const getOrCreateSession = (sessionId) => {
  if (!conversationStore.has(sessionId)) {
    conversationStore.set(sessionId, {
      history: [],
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  }

  const session = conversationStore.get(sessionId);
  session.lastActiveAt = Date.now();
  return session;
};

const addToHistory = (sessionId, role, content) => {
  const session = conversationStore.get(sessionId);
  if (!session) return;

  session.history.push({ role, content });

  if (session.history.length > MAX_HISTORY_LENGTH) {
    session.history = session.history.slice(-MAX_HISTORY_LENGTH);
  }
};

// Tự động dọn session hết hạn mỗi 10 phút
setInterval(
  () => {
    const now = Date.now();
    for (const [sid, session] of conversationStore.entries()) {
      if (now - session.lastActiveAt > SESSION_TTL_MS) {
        conversationStore.delete(sid);
        console.log(`[chatController] Session ${sid} expired and cleared`);
      }
    }
  },
  10 * 60 * 1000,
);

module.exports = { sendMessage, clearSession };
