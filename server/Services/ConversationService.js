const { MongoClient } = require("mongodb");

const COLLECTION_NAME = "conversations";
const DB_NAME = process.env.MONGO_DB_NAME || "shoe_store";
const MAX_MESSAGES = 20;
const SESSION_TTL_HOURS = 24;

let collection = null;

const init = async (db) => {
  collection = db.collection(COLLECTION_NAME);

  // Tạo TTL index để MongoDB tự xóa session hết hạn
  await collection.createIndex(
    { lastActiveAt: 1 },
    { expireAfterSeconds: SESSION_TTL_HOURS * 3600, background: true },
  );

  // Index tìm nhanh theo sessionId
  await collection.createIndex(
    { sessionId: 1 },
    { unique: true, background: true },
  );

  console.log(`[ConversationService] Sẵn sàng (TTL: ${SESSION_TTL_HOURS}h)`);
};

const getCollection = () => {
  if (!collection) throw new Error("ConversationService chưa được init()");
  return collection;
};

const getHistory = async (sessionId) => {
  const col = getCollection();
  const doc = await col.findOne({ sessionId });
  return doc?.messages || [];
};

const addMessage = async (sessionId, role, content) => {
  const col = getCollection();

  await col.updateOne(
    { sessionId },
    {
      $push: {
        messages: {
          $each: [{ role, content, timestamp: new Date() }],
          $slice: -MAX_MESSAGES, // Chỉ giữ MAX_MESSAGES tin nhắn cuối
        },
      },
      $set: { lastActiveAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
};

const addExchange = async (sessionId, userMessage, assistantMessage) => {
  const col = getCollection();

  const newMessages = [
    { role: "user", content: userMessage, timestamp: new Date() },
    { role: "assistant", content: assistantMessage, timestamp: new Date() },
  ];

  await col.updateOne(
    { sessionId },
    {
      $push: {
        messages: {
          $each: newMessages,
          $slice: -MAX_MESSAGES,
        },
      },
      $set: { lastActiveAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );
};

const clearSession = async (sessionId) => {
  const col = getCollection();
  await col.deleteOne({ sessionId });
};

const getSessionInfo = async (sessionId) => {
  const col = getCollection();
  const doc = await col.findOne(
    { sessionId },
    {
      projection: {
        createdAt: 1,
        lastActiveAt: 1,
        messages: { $size: "$messages" },
      },
    },
  );
  return doc || null;
};

module.exports = {
  init,
  getHistory,
  addMessage,
  addExchange,
  clearSession,
  getSessionInfo,
};
