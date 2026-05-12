# 👟 SneakSpirit

Website thương mại điện tử bán giày sneaker, dữ liệu sản phẩm được thu thập từ **Supersports Vietnam**. Tích hợp chatbot hỗ trợ khách hàng sử dụng kiến trúc **RAG (Retrieval-Augmented Generation)**.

🌐 **Frontend:** [sneak-spirit.vercel.app](https://sneak-spirit.vercel.app/)  
⚙️ **Backend:** [sneakspirit-1.onrender.com](https://sneakspirit-1.onrender.com/)

---

## ✨ Tính năng nổi bật

### 🛍️ Phía khách hàng

- **Duyệt & tìm kiếm sản phẩm** — lọc theo danh mục, thương hiệu, giá, size; sắp xếp theo giá / mới nhất / phổ biến
- **Trang chi tiết sản phẩm** — hình ảnh, mô tả, lựa chọn size/màu, đánh giá
- **Giỏ hàng & thanh toán** — thêm/xóa/cập nhật sản phẩm, xác nhận đơn hàng
- **Voucher & khuyến mãi** — nhập mã giảm giá, áp dụng tự động khi đủ điều kiện
- **Quản lý đơn hàng cá nhân** — xem lịch sử, trạng thái đơn, hủy đơn
- **Xác thực tài khoản** — đăng ký, đăng nhập, quản lý thông tin cá nhân
- **Chatbot AI** — hỏi đáp về sản phẩm, tư vấn size, chính sách đổi trả

### 🔧 Phía quản trị (Admin)

- **Dashboard tổng quan** — thống kê doanh thu, đơn hàng, người dùng
- **Quản lý sản phẩm** — thêm, sửa, xóa, phân loại sản phẩm
- **Quản lý đơn hàng** — xem, cập nhật trạng thái, xử lý đơn
- **Quản lý voucher** — tạo mã giảm giá, thiết lập điều kiện & thời hạn
- **Quản lý người dùng** — xem danh sách, khóa/mở tài khoản

---

## 🤖 Chatbot RAG

Chatbot được xây dựng theo kiến trúc RAG với các thành phần:

| Thành phần   | Công nghệ                       | Vai trò                                            |
| ------------ | ------------------------------- | -------------------------------------------------- |
| Embedding    | **Nomic Embed**                 | Vector hóa sản phẩm & câu hỏi                      |
| Vector Store | **MongoDB Atlas Vector Search** | Lưu trữ & truy xuất chunks theo ngữ nghĩa          |
| Reranking    | **Jina Reranker**               | Đọc chunks từ Atlas, sắp xếp lại theo độ liên quan |
| LLM          | **Groq**                        | Nhận context từ Jina, tạo câu trả lời tốc độ cao   |

**Luồng hoạt động:**

1. Người dùng đặt câu hỏi → Nomic Embed vector hóa câu hỏi
2. MongoDB Atlas Vector Search truy xuất top-K chunks liên quan
3. Jina Reranker đọc các chunks đó, sắp xếp lại theo độ chính xác
4. Groq LLM nhận context đã rerank → sinh câu trả lời tự nhiên, tốc độ cao

---

## 🛠️ Tech Stack

| Layer    | Công nghệ                                                     |
| -------- | ------------------------------------------------------------- |
| Frontend | React 18, Vite, React Router, Axios                           |
| Backend  | Node.js, Express.js                                           |
| Database | MongoDB Atlas, Mongoose                                       |
| Auth     | JWT (JSON Web Token)                                          |
| Scraping | **Thunderbit** (Supersports VN)                               |
| AI / RAG | Nomic Embed, MongoDB Atlas Vector Search, Jina Reranker, Groq |
| Styling  | Tailwind CSS                                                  |
| Deploy   | Vercel (frontend), Render (backend)                           |

---

## 📄 License

MIT © [dtam2812](https://github.com/dtam2812)
