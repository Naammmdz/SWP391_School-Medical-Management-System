import React from "react";
import { Link } from "react-router-dom";
import "./Blog.css";

export default function Blog({ blogPosts = [], isLoading }) {
  // Màu gradient demo cho từng category
  const gradientMap = {
    'Phòng ngừa': 'from-blue-400 to-blue-600',
    'Dinh dưỡng': 'from-green-400 to-green-600',
    'Cấp cứu': 'from-red-400 to-red-600',
    'Tâm lý': 'from-purple-400 to-purple-600',
    'Vận động': 'from-yellow-400 to-orange-600',
    'Môi trường': 'from-indigo-400 to-indigo-600',
  };
  return (
    <section className="blog-modern-section">
      <div className="blog-modern-container">
        <div className="blog-modern-header">
          <div className="blog-modern-badge">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blog-modern-badge-icon"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
            Kiến thức sức khỏe
          </div>
          <h2 className="blog-modern-title">Tài liệu và hướng dẫn chăm sóc sức khỏe</h2>
          <p className="blog-modern-desc">Cập nhật những kiến thức y tế mới nhất và hướng dẫn thực hành tốt nhất cho việc chăm sóc sức khỏe học sinh</p>
        </div>
        <div className="blog-modern-grid">
          {blogPosts.length > 0 ? (
            blogPosts.map((post, idx) => {
              const gradient = gradientMap[post.category] || 'from-blue-400 to-blue-600';
              return (
                <div key={post.id} className="blog-modern-card group">
                  <div className={`blog-modern-card-img bg-gradient-to-br ${gradient}`} style={post.thumbnail ? {backgroundImage: `url(${post.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center'} : {}}>
                    <div className="blog-modern-card-img-overlay group-hover:bg-opacity-10"></div>
                    <div className="blog-modern-card-badge">{post.category || 'Chia sẻ'}</div>
                    <div className="blog-modern-card-readtime">{post.readTime || '5 phút đọc'}</div>
                  </div>
                  <div className="blog-modern-card-content">
                    <h3 className="blog-modern-card-title group-hover:text-blue-600">{post.title}</h3>
                    <p className="blog-modern-card-excerpt">{post.excerpt}</p>
                    <div className="blog-modern-card-footer">
                      <Link to={`/blog/${post.id}`} className="blog-modern-card-btn">Đọc thêm
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blog-modern-card-btn-icon"><path d="m9 18 6-6-6-6"></path></svg>
                      </Link>
                      <div className="blog-modern-card-type">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="blog-modern-card-type-icon"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                        {post.type || 'Hướng dẫn'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="blog-modern-nodata">Không có bài viết nào.</div>
          )}
        </div>
        <div className="blog-modern-footer">
          <Link to="/blog" className="blog-modern-footer-btn">Xem thư viện tài liệu đầy đủ</Link>
        </div>
      </div>
    </section>
  );
}
