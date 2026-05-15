import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "../Common";

const POSTS_PER_PAGE = 7;

const BlogManagement = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    getListBlog();
  }, []);

  const getListBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/blog/blog-admin/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("getListBlogAdmin error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || content === "<p><br></p>") {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(
        "/api/blog/blog/create",
        {
          title: title.trim(),
          excerpt: excerpt.trim(),
          coverImage: coverImage.trim(),
          tags: tags
            ? tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : [],
          author: author.trim() || "Admin",
          content,
          published: isPublished,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert("Đăng bài viết thành công!");
      setTitle("");
      setExcerpt("");
      setCoverImage("");
      setTags("");
      setAuthor("");
      setContent("");
      setIsPublished(true);
      setCurrentPage(1);
      getListBlog();
    } catch (error) {
      console.log("postBlog error", error);
      alert(error.response?.data?.error || "Lưu bài viết thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?"))
      return;
    try {
      await axios.delete(`/api/blog/blog/delete/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Đã xóa bài viết.");
      setBlogs((prev) => prev.filter((b) => b._id !== blogId));
    } catch (error) {
      console.log("deleteBlog error", error);
      alert(error.response?.data?.error || "Xóa thất bại.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const totalPages = Math.ceil(blogs.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginated = blogs.slice(startIndex, startIndex + POSTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10 font-sans">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Quản lý nội dung Blog
            </h1>
            <p className="mt-2 text-slate-500">
              Soạn thảo bài viết mới và quản lý các nội dung hiện có.
            </p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
          {/* ── Danh sách bài viết ── */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                Bài viết đã đăng
              </h2>
              {blogs.length > 0 && (
                <span className="text-xs text-slate-500">
                  {blogs.length} bài viết
                </span>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold">
                  <tr>
                    <th className="px-4 py-3">Ảnh</th>
                    <th className="px-4 py-3">Nội dung</th>
                    <th className="px-2 py-3">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-10 text-center">
                        <div className="flex justify-center gap-2">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-2.5 h-2.5 bg-gray-900 rounded-full animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-10 text-center text-slate-400"
                      >
                        Chưa có bài viết nào.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((blog) => (
                      <tr
                        key={blog._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {/* Ảnh */}
                        <td className="px-4 py-4">
                          <div className="h-14 w-20 overflow-hidden rounded-xl bg-slate-100">
                            {blog.coverImage ? (
                              <img
                                src={blog.coverImage}
                                className="h-full w-full object-cover"
                                alt="thumb"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                                No Image
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Nội dung */}
                        <td className="px-4 py-4">
                          <p className="font-bold text-slate-900 line-clamp-1">
                            {blog.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {formatDate(blog.createdAt)} •{" "}
                            {blog.author || "Admin"}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                blog.published
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {blog.published ? "Đã đăng" : "Nháp"}
                            </span>
                            {blog.tags?.length > 0 && (
                              <span className="text-[10px] text-slate-400">
                                {blog.tags.join(", ")}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Thao tác */}
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/blog/${blog.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 text-center whitespace-nowrap"
                            >
                              Xem
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100 whitespace-nowrap"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-200">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600
                      hover:border-slate-400 hover:text-slate-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      const isVisible =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1;

                      const showDotsBefore =
                        page === currentPage - 2 && currentPage - 2 > 1;
                      const showDotsAfter =
                        page === currentPage + 2 &&
                        currentPage + 2 < totalPages;

                      if (showDotsBefore || showDotsAfter) {
                        return (
                          <span
                            key={page}
                            className="px-1 text-slate-400 text-sm"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!isVisible) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 text-sm font-semibold rounded-xl border transition
                          ${
                            currentPage === page
                              ? "bg-slate-900 text-white border-slate-900"
                              : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-900"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    },
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1.5 text-sm font-semibold rounded-xl border border-slate-200 text-slate-600
                      hover:border-slate-400 hover:text-slate-900 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Form soạn bài  */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              Soạn bài viết mới
            </h2>
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  placeholder="Ví dụ: Hướng dẫn chăm sóc giày sneaker..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tác giả
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    placeholder="Admin"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Tags (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                    placeholder="Nike, Jordan, Sneaker..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Mô tả ngắn (Excerpt)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  placeholder="Tóm tắt nội dung bài viết..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  URL Ảnh đại diện
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nội dung bài viết
                </label>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-inner">
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Bắt đầu viết nội dung tại đây..."
                    className="min-h-[300px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-600">
                    Xuất bản ngay
                  </span>
                </label>

                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="rounded-2xl bg-slate-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-slate-800 disabled:bg-slate-400 transition-all active:scale-95"
                >
                  {saving ? "Đang xử lý..." : "Đăng bài viết"}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;
