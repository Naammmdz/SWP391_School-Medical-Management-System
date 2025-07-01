import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './Layout.css';
import { useLocation } from 'react-router-dom';

const Layout = ({ children, showSidebar = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  // Ẩn header/footer nếu là trang login
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      if (userData && userData !== "undefined" && userData !== "null") {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('user');
    }
    setIsUserChecked(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Kiểm tra xem có nên hiện sidebar không
  const shouldShowSidebar = showSidebar && user && user.userRole;

  // Các path cần ẩn footer
  const hideFooterPaths = [
    '/thongke', '/dashboard', '/admin', '/parent', '/nurse',
    '/hososuckhoe', '/sukienyte', '/khaibaothuoc', '/quanlythuoc', '/quanlytiemchung', '/thongbaotiemchung',
    '/kiemtradinhky', '/danhsachkiemtradinhky', '/capnhatkiemtradinhky', '/kiemtradinhkyhocsinh', '/ketquakiemtradinhky', '/capnhatthongtin', '/doimatkhau', '/admin/taomoinguoidung', '/admin/capnhatnguoidung', '/admin/danhsachnguoidung', '/admin/khoanguoidung', '/taomoihocsinh', '/danhsachhocsinh', '/capnhathocsinh', '/taosukientiemchung', '/ketquatiemchung', '/ketquatiemchunghocsinh', '/capnhatthongtintiemchung', '/blog', '/donthuocdagui'
  ];
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path));

  if (!isUserChecked && showSidebar) return null;

  return (
    <div className="app-layout">
      {!isLoginPage && !shouldShowSidebar && <Header />}
      {shouldShowSidebar && !isLoginPage && (
        <Sidebar
          userRole={user && user.userRole}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          className="no-header"
        />
      )}
      <main 
        className="main-content"
        style={{
          marginLeft: shouldShowSidebar ? (isCollapsed ? '64px' : '256px') : '0',
          marginTop: shouldShowSidebar ? '0' : '0px', // Chỉ margin top khi có Header
          transition: 'margin-left 0.3s ease-in-out',
          minHeight: 'calc(100vh - 144px)', // Trừ header (72px) và footer (72px)
          padding: shouldShowSidebar ? '20px' : '0'
        }}
      >
        {children}
      </main>
      {!isLoginPage && !shouldHideFooter && <Footer />}
    </div>
  );
};

export default Layout;
