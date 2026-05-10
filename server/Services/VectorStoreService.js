const { VECTOR_DIMENSION } = require("./EmbeddingService");

const COLLECTION_NAME = "rag_chunks";
const INDEX_NAME = "vector_index";

let collection = null;

const init = async (db) => {
  collection = db.collection(COLLECTION_NAME);
  console.log(
    `[VectorStoreService] Sẵn sàng — collection "${COLLECTION_NAME}"`,
  );
};

const getCollection = () => {
  if (!collection) throw new Error("VectorStoreService chưa được init()");
  return collection;
};

const upsert = async (chunks) => {
  const col = getCollection();
  const operations = chunks.map((chunk) => ({
    updateOne: {
      filter: { chunkId: chunk.id },
      update: {
        $set: {
          chunkId: chunk.id,
          text: chunk.text,
          embedding: chunk.vector,
          metadata: chunk.metadata,
          updatedAt: new Date(),
        },
      },
      upsert: true,
    },
  }));
  return await col.bulkWrite(operations);
};

const similaritySearch = async (queryVector, options = {}) => {
  const col = getCollection();
  const { topK = 5, filter = {} } = options;

  const pipeline = [
    {
      $vectorSearch: {
        index: INDEX_NAME,
        path: "embedding",
        queryVector,
        numCandidates: topK * 10,
        limit: topK,
        ...(Object.keys(filter).length > 0 && { filter }),
      },
    },
    {
      $project: {
        _id: 0,
        chunkId: 1,
        text: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  return await col.aggregate(pipeline).toArray();
};

const deleteByType = async (type) => {
  const col = getCollection();
  const result = await col.deleteMany({ "metadata.type": type });
  console.log(
    `[VectorStoreService] Xóa ${result.deletedCount} chunks type="${type}"`,
  );
  return result;
};

const clearAll = async () => {
  const col = getCollection();
  const result = await col.deleteMany({});
  console.log(`[VectorStoreService] Xóa ${result.deletedCount} chunks`);
  return result;
};

module.exports = { init, upsert, similaritySearch, deleteByType, clearAll };
