import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

export default function Blog({ blogPosts, isLoading }) {
  return (
    <section className="section blog-section">
      <div className="container">
        <div className="section-header">
          <h2>Blog và chia sẻ kinh nghiệm</h2>
          <p>Kiến thức và lời khuyên từ đội ngũ y tế chuyên nghiệp</p>
        </div>

        {isLoading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <div className="blog-posts">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <div key={post.id} className="blog-post">
                  <div className="post-thumbnail">
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p className="post-meta">
                      <span className="post-author">{post.author}</span>
                      <span className="post-date">
                        {new Date(post.publishedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </p>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="read-more">
                      Đọc tiếp
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">Không có bài viết nào.</div>
            )}
          </div>
        )}

        <div className="blog-footer">
          <Link to="/blog" className="btn btn-primary">
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  );
}
