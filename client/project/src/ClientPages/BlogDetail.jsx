import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../AdminComponents/Common";
import Breadcrumb from "../components/Breadcrumb";

// Tạo carousel HTML từ danh sách ảnh và caption
function buildCarousel(urls, caption) {
  const id = "carousel_" + Math.random().toString(36).slice(2, 8);
  const dots = urls
    .map(
      (_, i) =>
        `<button onclick="carouselGo('${id}',${i})" id="${id}_dot_${i}"
          style="width:8px;height:8px;border-radius:50%;border:none;cursor:pointer;padding:0;
          background:${i === 0 ? "#fff" : "rgba(255,255,255,0.4)"}">
        </button>`,
    )
    .join("");

  const slides = urls
    .map(
      (url, i) =>
        `<div id="${id}_slide_${i}"
          style="display:${i === 0 ? "block" : "none"};width:100%;height:100%;">
          <img src="${url.trim()}" alt="slide ${i + 1}"
            style="width:100%;height:100%;object-fit:cover;border-radius:12px;" />
        </div>`,
    )
    .join("");

  const captionHtml = caption
    ? `<p style="text-align:center;font-style:italic;color:#6b7280;font-size:14px;margin-top:12px;">${caption}</p>`
    : "";

  return `
    <div style="margin:32px 0;">
      <div id="${id}" style="position:relative;width:100%;aspect-ratio:4/3;background:#f3f4f6;border-radius:12px;overflow:hidden;">
        ${slides}
        <!-- Nút trái -->
        <button onclick="carouselPrev('${id}',${urls.length})"
          style="position:absolute;left:12px;top:50%;transform:translateY(-50%);
          background:rgba(255,255,255,0.85);border:none;border-radius:50%;
          width:36px;height:36px;font-size:16px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;z-index:10;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);">‹</button>
        <!-- Nút phải -->
        <button onclick="carouselNext('${id}',${urls.length})"
          style="position:absolute;right:12px;top:50%;transform:translateY(-50%);
          background:rgba(255,255,255,0.85);border:none;border-radius:50%;
          width:36px;height:36px;font-size:16px;cursor:pointer;
          display:flex;align-items:center;justify-content:center;z-index:10;
          box-shadow:0 2px 6px rgba(0,0,0,0.2);">›</button>
        <!-- Counter -->
        <div id="${id}_counter"
          style="position:absolute;bottom:12px;right:12px;
          background:rgba(0,0,0,0.5);color:#fff;
          font-size:12px;font-weight:600;padding:2px 8px;border-radius:20px;">
          1 / ${urls.length}
        </div>
        <!-- Dots -->
        <div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);
          display:flex;gap:6px;align-items:center;">
          ${dots}
        </div>
      </div>
      ${captionHtml}
    </div>`;
}

// Inject script carousel vào window (chỉ 1 lần)
function injectCarouselScript() {
  if (window.__carouselInjected) return;
  window.__carouselInjected = true;
  window.__carouselIndex = {};

  window.carouselGo = (id, index) => {
    const container = document.getElementById(id);
    if (!container) return;
    const slides = container.querySelectorAll(`[id^="${id}_slide_"]`);
    const dots = document.querySelectorAll(`[id^="${id}_dot_"]`);
    const counter = document.getElementById(`${id}_counter`);
    slides.forEach((s) => (s.style.display = "none"));
    dots.forEach((d) => (d.style.background = "rgba(255,255,255,0.4)"));
    slides[index].style.display = "block";
    if (dots[index]) dots[index].style.background = "#fff";
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
    window.__carouselIndex[id] = index;
  };

  window.carouselNext = (id, total) => {
    const cur = window.__carouselIndex[id] ?? 0;
    window.carouselGo(id, (cur + 1) % total);
  };

  window.carouselPrev = (id, total) => {
    const cur = window.__carouselIndex[id] ?? 0;
    window.carouselGo(id, (cur - 1 + total) % total);
  };
}

function renderMarkdown(md) {
  if (!md) return "";

  // Inject carousel script khi render
  setTimeout(injectCarouselScript, 0);

  return (
    md
      // Gallery: [gallery:url1,url2,...|caption]
      .replace(
        /\[gallery:([^\]|]+)(?:\|([^\]]*))?\]/g,
        (_, urlsPart, caption) => {
          const urls = urlsPart
            .split(",")
            .map((u) => u.trim())
            .filter(Boolean);
          if (urls.length === 0) return "";
          if (urls.length === 1)
            return `<img src="${urls[0]}" class="w-full rounded-xl my-6 shadow-sm" />`;
          return buildCarousel(urls, caption || "");
        },
      )
      // Headings
      .replace(
        /^### (.+)$/gm,
        '<h3 class="text-xl font-bold mt-8 mb-3 text-gray-900">$1</h3>',
      )
      .replace(
        /^## (.+)$/gm,
        '<h2 class="text-2xl font-black mt-10 mb-4 text-gray-900" style="font-family:Roboto,serif">$1</h2>',
      )
      .replace(
        /^# (.+)$/gm,
        '<h1 class="text-3xl font-black mt-12 mb-5 text-gray-900" style="font-family:Roboto,serif">$1</h1>',
      )
      // Bold + italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-bold text-gray-900">$1</strong>',
      )
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      // Blockquote
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-black pl-5 my-6 text-gray-600 italic text-lg">$1</blockquote>',
      )
      // Unordered list
      .replace(
        /^\- (.+)$/gm,
        '<li class="ml-6 list-disc text-gray-700 mb-1">$1</li>',
      )
      .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>')
      // Ordered list
      .replace(
        /^\d+\. (.+)$/gm,
        '<li class="ml-6 list-decimal text-gray-700 mb-1">$1</li>',
      )
      // Images
      .replace(
        /!\[(.+?)\]\((.+?)\)/g,
        '<img src="$2" alt="$1" class="w-full rounded-xl my-6 shadow-sm" />',
      )
      // Links
      .replace(
        /\[(.+?)\]\((.+?)\)/g,
        '<a href="$2" class="text-red-600 underline hover:text-red-800 font-medium" target="_blank">$1</a>',
      )
      // Code block
      .replace(
        /```[\w]*\n([\s\S]+?)```/g,
        '<pre class="bg-gray-900 text-green-400 p-4 rounded my-6 overflow-x-auto text-sm font-mono"><code>$1</code></pre>',
      )
      // Inline code
      .replace(
        /`(.+?)`/g,
        '<code class="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>',
      )
      // Horizontal rule
      .replace(/^---$/gm, '<hr class="my-8 border-gray-200" />')
      // Paragraphs
      .replace(/\n\n(.+?)(?=\n\n|$)/gs, (_, p) => {
        if (p.startsWith("<")) return p;
        return `<p class="text-gray-700 leading-relaxed mb-5 text-[17px]">${p.replace(/\n/g, " ")}</p>`;
      })
  );
}

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
      const response = await axios.get(`/api/blog/blog/${slug}`);
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

      <div className="max-w-4xl mx-auto px-6 py-12">
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
          style={{ fontFamily: "'Roboto'" }}
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

        {/* Content */}
        <article
          dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
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
