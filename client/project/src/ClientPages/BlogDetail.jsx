import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../AdminComponents/Common";
import Breadcrumb from "../components/Breadcrumb";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const BlogDetail = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/blog/${slug}`);
      setBlog(response.data);
    } catch (err) {
      console.log("getBlogBySlug error", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Không tìm thấy bài viết
          </h2>
          <Link to="/blog" className="text-red-600 hover:underline">
            ← Quay lại Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Cover Image */}
      {blog.coverImage && (
        <div className="w-full h-[50vh] overflow-hidden">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Breadcrumb first="Blog" second={blog.title} secondLink="/blog" />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 mb-5">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blog?tag=${tag}`}
                className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-black text-white hover:bg-red-600 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {blog.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 pb-8 border-b border-gray-200 mb-10">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold">
            {blog.author?.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-gray-700">{blog.author}</span>
          <span>·</span>
          <span>{formatDate(blog.createdAt)}</span>
          {blog.updatedAt !== blog.createdAt && (
            <>
              <span>·</span>
              <span className="italic">
                Cập nhật {formatDate(blog.updatedAt)}
              </span>
            </>
          )}
        </div>

        {/* Content - render HTML từ Quill */}
        <article
          className="prose max-w-none text-gray-700 leading-relaxed text-[17px]"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <Link
            to="/blog"
            className="text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            ← Tất cả bài viết
          </Link>
          {blog.tags?.length > 0 && (
            <div className="flex gap-2">
              {blog.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/blog?tag=${tag}`}
                  className="text-xs text-gray-500 hover:text-black border border-gray-300 hover:border-black px-2 py-1 transition"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
