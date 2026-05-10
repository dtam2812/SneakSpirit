require("dotenv").config();
const mongoose = require("mongoose");
const connectDatabase = require("../Services/ConnectDbService");
const EmbeddingService = require("../Services/EmbeddingService");
const VectorStoreService = require("../Services/VectorStoreService");
const Product = require("../Models/ProductModel");

const BATCH_SIZE = 20;

const getAvailableSizes = (sizes) => {
  if (!sizes) return "Không rõ";
  const available = Object.entries(sizes)
    .filter(([_, qty]) => qty > 0)
    .map(([size]) => size.replace("_", "."));
  return available.length > 0 ? available.join(", ") : "Hết tất cả size";
};

const productToChunk = (product) => {
  const hasDiscount = product.discountPercent > 0 && product.originalPrice;

  const lines = [
    `Tên sản phẩm: ${product.productName}`,
    `Thương hiệu: ${product.brand}`,
    `Danh mục: ${product.category}`,
    `Giá bán: ${product.price?.toLocaleString("vi-VN")}đ`,
    hasDiscount
      ? `Giá gốc: ${product.originalPrice?.toLocaleString("vi-VN")}đ`
      : null,
    hasDiscount ? `Giảm giá: ${product.discountPercent}%` : null,
    `Size còn hàng (US): ${getAvailableSizes(product.sizes)}`,
    `Số lượng tồn kho: ${product.quantity > 0 ? product.quantity : "Hết hàng"}`,
    product.description ? `Mô tả: ${product.description}` : null,
    product.specifications ? `Thông số: ${product.specifications}` : null,
    product.careInstructions
      ? `Hướng dẫn bảo quản: ${product.careInstructions}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    id: `product_${product._id}`,
    text: lines,
    metadata: {
      type: "product",
      productId: product._id.toString(),
      name: product.productName,
      brand: product.brand,
      price: product.price,
      category: product.category,
      inStock: product.quantity > 0,
    },
  };
};

const getStaticFAQChunks = () => [
  {
    id: "policy_return",
    text: `Chính sách đổi trả SneakSpirit:
- Đổi trả trong vòng 7 ngày kể từ khi nhận hàng.
- Sản phẩm phải còn nguyên tem, nhãn, chưa qua sử dụng.
- Mang hoá đơn hoặc ảnh xác nhận đơn hàng.
- Liên hệ hotline để được hỗ trợ đổi trả.`,
    metadata: { type: "policy", topic: "return" },
  },
  {
    id: "policy_shipping",
    text: `Chính sách vận chuyển SneakSpirit:
- Miễn phí ship đơn từ 500.000đ.
- Giao hàng nội thành TP.HCM: 1-2 ngày.
- Giao hàng tỉnh thành khác: 3-5 ngày.
- Đơn hàng được đóng gói cẩn thận kèm hộp giày.`,
    metadata: { type: "policy", topic: "shipping" },
  },
  {
    id: "policy_warranty",
    text: `Bảo hành sản phẩm SneakSpirit:
- Bảo hành 6 tháng với lỗi từ nhà sản xuất (bong đế, đứt chỉ...).
- Không bảo hành lỗi do sử dụng sai cách hoặc va đập mạnh.
- Mang sản phẩm đến cửa hàng hoặc gửi qua bưu điện.`,
    metadata: { type: "policy", topic: "warranty" },
  },
  {
    id: "faq_size",
    text: `Hướng dẫn chọn size giày tại SneakSpirit:
- Giày dùng hệ size US.
- US6 ≈ EU39, US7 ≈ EU40, US8 ≈ EU41, US9 ≈ EU42, US10 ≈ EU43.
- Nên chọn tăng 0.5 size nếu bàn chân rộng.
- Đo bàn chân vào buổi chiều để có số đo chính xác nhất.`,
    metadata: { type: "faq", topic: "sizing" },
  },
  {
    id: "faq_payment",
    text: `Phương thức thanh toán tại SneakSpirit:
- Thanh toán khi nhận hàng (COD).
- Chuyển khoản ngân hàng.
- Ví điện tử: MoMo, ZaloPay, VNPay.`,
    metadata: { type: "faq", topic: "payment" },
  },
];

const upsertChunks = async (chunks) => {
  let count = 0;
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);

    const embedded = [];
    for (const chunk of batch) {
      const vector = await EmbeddingService.embedText(
        chunk.text,
        "RETRIEVAL_DOCUMENT",
      );
      embedded.push({ ...chunk, vector });
      await new Promise((r) => setTimeout(r, 500));
    }

    await VectorStoreService.upsert(embedded);
    count += batch.length;
    console.log(`${count}/${chunks.length} chunks`);
  }
};

const ingestProducts = async () => {
  console.log("\nIngest sản phẩm...");
  const products = await Product.find().lean();
  console.log(`  Tìm thấy ${products.length} sản phẩm`);
  if (products.length === 0) {
    console.log("Không có sản phẩm nào");
    return;
  }
  const chunks = products.map(productToChunk);
  await upsertChunks(chunks);
  console.log(`Xong ${products.length} sản phẩm`);
};

const ingestFAQs = async () => {
  console.log("\nIngest FAQ & chính sách...");
  const chunks = getStaticFAQChunks();
  await upsertChunks(chunks);
  console.log(`Xong ${chunks.length} mục FAQ`);
};

const main = async () => {
  const typeArg = process.argv
    .find((a) => a.startsWith("--type="))
    ?.split("=")[1];

  console.log("SneakSpirit — IngestData bắt đầu");

  try {
    await connectDatabase();
    console.log("Kết nối MongoDB thành công");

    const db = mongoose.connection.db;
    await VectorStoreService.init(db);
    console.log("VectorStore sẵn sàng");

    if (!typeArg || typeArg === "products") await ingestProducts();
    if (!typeArg || typeArg === "faqs") await ingestFAQs();

    console.log("\nHoàn thành! Dữ liệu sẵn sàng cho RAG.");
  } catch (error) {
    console.error("\nLỗi:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Đã ngắt kết nối");
    process.exit(0);
  }
};

main();
