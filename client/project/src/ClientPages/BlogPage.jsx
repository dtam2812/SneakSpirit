import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../AdminComponents/Common";
import Breadcrumb from "../components/Breadcrumb";

const TAG_COLORS = {
  Sneaker: "bg-black text-white",
  Review: "bg-stone-700 text-white",
  Style: "bg-stone-500 text-white",
  "Tin tức": "bg-red-600 text-white",
  "Hướng dẫn": "bg-stone-800 text-white",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function TagBadge({ tag, size = "sm" }) {
  const colorClass = TAG_COLORS[tag] || "bg-stone-100 text-stone-700";
  const sizeClass =
    size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";
  return (
    <span
      className={`font-bold uppercase tracking-widest ${colorClass} ${sizeClass}`}
    >
      {tag}
    </span>
  );
}

function FeaturedPost({ blog }) {
  return (
    <Link to={`/blog/${blog.slug}`} className="group block mb-12">
      <div className="grid md:grid-cols-2 gap-0 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-64 md:h-auto min-h-[320px] bg-gray-100 overflow-hidden">
          {blog.coverImage ? (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-400 flex items-center justify-center">
              <span className="text-5xl">👟</span>
            </div>
          )}
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
            <h2
              className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4 group-hover:text-red-600 transition-colors"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              {blog.title}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed line-clamp-3">
              {blog.excerpt}
            </p>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="font-medium text-gray-700">{blog.author}</span>
              <span className="mx-2">·</span>
              {formatDate(blog.createdAt)}
            </div>
            <span className="text-sm font-bold text-black group-hover:text-red-600 transition-colors">
              Đọc bài →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function BlogCard({ blog }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {blog.coverImage ? (
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
            <span className="text-3xl">👟</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {blog.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} tag={tag} size="xs" />
          ))}
        </div>
        <h3
          className="font-black text-gray-900 text-lg leading-tight mb-2 group-hover:text-red-600 transition-colors line-clamp-2"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {blog.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
          {blog.excerpt}
        </p>
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>{blog.author}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const getListBlog = async () => {
      try {
        const response = await axios.get("/api/blog/blog");
        setBlogs(response.data);
        setAllTags(
          Array.from(new Set(response.data.flatMap((b) => b.tags))).filter(
            Boolean,
          ),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getListBlog();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
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

  const filtered = activeTag
    ? blogs.filter((b) => b.tags.includes(activeTag))
    : blogs;
  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      <Breadcrumb first="Blog" />
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-8">
        {/*Header*/}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-4 mb-10">
          <div>
            <h1
              className="text-6xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Blog
            </h1>
            <p className="text-gray-500 mt-3 text-base max-w-sm">
              Tin tức, review và câu chuyện về thế giới sneaker.
            </p>
          </div>

          {/*TagFilter*/}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border transition ${
                  activeTag === null
                    ? "bg-black text-white border-black"
                    : "bg-transparent text-gray-600 border-gray-300 hover:border-black hover:text-black"
                }`}
              >
                Tất cả
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest border transition ${
                    activeTag === tag
                      ? "bg-black text-white border-black"
                      : "bg-transparent text-gray-600 border-gray-300 hover:border-black hover:text-black"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/*EmptyState*/}
        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <p className="text-xl">Chưa có bài viết nào.</p>
          </div>
        )}

        {/*FeaturedPost*/}
        {featured && <FeaturedPost blog={featured} />}

        {/*BlogGrid*/}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
