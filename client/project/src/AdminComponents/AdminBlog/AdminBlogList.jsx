import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../Common";

const AdminBlogList = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/blog-admin/list");
      setBlogs(response.data);
    } catch (err) {
      console.log("getListBlogAdmin error", err);
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    setMessage(null);
    setError(null);
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await axios.delete(`/blog/delete/${blogId}`);
      setMessage("Xóa bài viết thành công.");
      setBlogs((prev) => prev.filter((item) => item._id !== blogId));
    } catch (err) {
      console.log("deleteBlog error", err);
      setError(err.response?.data?.error || "Xóa bài viết thất bại.");
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Danh sách Blog
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Quản lý bài viết đã đăng, xem trước, và xóa khi cần.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/admin/blog"
                className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Tạo bài viết mới
              </Link>
            </div>
          </div>

          {/* Thông báo */}
          {message && (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900">
              {error}
            </div>
          )}

          {/* Desktop table */}
          <div className="hidden sm:block overflow-hidden rounded-3xl border border-slate-200 bg-white text-sm shadow-sm">
            <div className="grid grid-cols-[3fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-100 px-4 py-4 text-slate-600 font-semibold">
              <div>Tiêu đề</div>
              <div className="hidden lg:block">Tác giả</div>
              <div>Ngày tạo</div>
              <div>Hành động</div>
            </div>

            {loading ? (
              <div className="px-4 py-10 text-center text-slate-500">
                Đang tải bài viết...
              </div>
            ) : blogs.length === 0 ? (
              <div className="px-4 py-10 text-center text-slate-500">
                Chưa có bài viết nào.
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="grid grid-cols-[3fr_1fr_1fr_auto] gap-4 border-b border-slate-200 px-4 py-4 items-center last:border-b-0"
                >
                  <div>
                    <div className="font-semibold text-slate-900 line-clamp-1">
                      {blog.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {blog.excerpt || "Không có mô tả ngắn."}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      /{blog.slug}
                    </div>
                  </div>
                  <div className="hidden lg:block text-slate-700">
                    {blog.author || "Admin"}
                  </div>
                  <div className="text-slate-700 whitespace-nowrap">
                    {formatDate(blog.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/blog/${blog.slug}`}
                      rel="noreferrer"
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 whitespace-nowrap"
                    >
                      Xem
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog._id)}
                      className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100 whitespace-nowrap"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile card list */}
          <div className="sm:hidden space-y-3">
            {loading ? (
              <div className="py-10 text-center text-slate-500">
                Đang tải bài viết...
              </div>
            ) : blogs.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                Chưa có bài viết nào.
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="font-semibold text-slate-900 mb-1">
                    {blog.title}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2 mb-2">
                    {blog.excerpt || "Không có mô tả ngắn."}
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-slate-400">
                      {formatDate(blog.createdAt)} · {blog.author || "Admin"}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/blog/${blog.slug}`}
                        rel="noreferrer"
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                      >
                        Xem
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogList;
