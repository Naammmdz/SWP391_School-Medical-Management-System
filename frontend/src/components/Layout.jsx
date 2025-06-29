import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar.jsx';
import './Layout.css';

const Layout = ({ children, showSidebar = false }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    return (
        <div className="app-layout">
            <Header />

            {shouldShowSidebar && (
                <Sidebar
                    userRole={user.userRole}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />
            )}      <main
            className="main-content"
            style={{
                marginLeft: shouldShowSidebar ? (isCollapsed ? '64px' : '256px') : '0',
                marginTop: '72px', // Margin top để không bị che bởi header
                transition: 'margin-left 0.3s ease-in-out',
                minHeight: 'calc(100vh - 144px)', // Trừ header (72px) và footer (72px)
                padding: shouldShowSidebar ? '20px' : '0'
            }}
        >
            {children}
        </main>

            <Footer />
        </div>
    );
};

export default Layout;