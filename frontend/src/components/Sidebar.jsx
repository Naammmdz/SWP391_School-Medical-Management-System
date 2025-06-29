import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import './Sidebar.css';

// Icons - sử dụng emoji hoặc text thay thế lucide-react
const iconMap = {
    home: '🏠',
    users: '👥',
    shield: '🛡️',
    stethoscope: '🩺',
    archive: '📦',
    syringe: '💉',
    activity: '⚡',
    settings: '⚙️',
    briefcase: '💼',
    clipboard: '📋',
    bookUser: '📚',
    bell: '🔔',
    chevronLeft: '‹',
    chevronRight: '›',
    barChart: '📊',
    heart: '❤️',
    pill: '💊',
    calendar: '📅',
    report: '📄'
};

const navItems = [
    // Common
    {path: '/thongke', name: 'Bảng điều khiển', icon: 'home', roles: ['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PARENT']},
    {
        path: '/thongbaotiemchung',
        name: 'Thông báo',
        icon: 'bell',
        roles: ['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PARENT'],
        badge: '3'
    },

    // Admin
    {path: '/admin/danhsachnguoidung', name: 'Quản lý người dùng', icon: 'users', roles: ['ROLE_ADMIN']},
    {path: '/admin/taomoinguoidung', name: 'Tạo người dùng', icon: 'users', roles: ['ROLE_ADMIN']},
    {path: '/danhsachhocsinh', name: 'Quản lý học sinh', icon: 'bookUser', roles: ['ROLE_ADMIN']},
    {path: '/taomoihocsinh', name: 'Tạo học sinh', icon: 'bookUser', roles: ['ROLE_ADMIN']},
    {path: '/taosukientiemchung', name: 'Tạo chiến dịch tiêm chủng', icon: 'syringe', roles: ['ROLE_ADMIN']},
    {path: '/quanlytiemchung', name: 'Quản lý tiêm chủng', icon: 'syringe', roles: ['ROLE_ADMIN']},
    {path: '/admin', name: 'Quản trị hệ thống', icon: 'settings', roles: ['ROLE_ADMIN']},

    // Y tá (Nurse)
    {path: '/donthuoc', name: 'Đơn thuốc', icon: 'clipboard', roles: ['ROLE_NURSE'], badge: '2'},
    {path: '/sukienyte', name: 'Sự cố y tế', icon: 'activity', roles: ['ROLE_NURSE'], badge: '1'},
    {path: '/quanlythuoc', name: 'Quản lý thuốc', icon: 'pill', roles: ['ROLE_NURSE']},
    {path: '/kiemtradinhky', name: 'Tạo kiểm tra định kỳ', icon: 'stethoscope', roles: ['ROLE_NURSE']},
    {path: '/danhsachkiemtradinhky', name: 'Danh sách kiểm tra', icon: 'stethoscope', roles: ['ROLE_NURSE']},
    {path: '/kiemtradinhkyhocsinh', name: 'Khám sức khỏe', icon: 'stethoscope', roles: ['ROLE_NURSE']},
    {path: '/nurse', name: 'Trang Y tá', icon: 'stethoscope', roles: ['ROLE_NURSE']},

    // Phụ huynh (Parent)
    {path: '/hososuckhoe', name: 'Hồ sơ sức khỏe', icon: 'heart', roles: ['ROLE_PARENT']},
    {path: '/khaibaothuoc', name: 'Khai báo thuốc', icon: 'briefcase', roles: ['ROLE_PARENT']},
    {path: '/parent', name: 'Trang Phụ huynh', icon: 'heart', roles: ['ROLE_PARENT']},
];

const Sidebar = ({userRole, isCollapsed = false, onToggleCollapse}) => {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

    const getRoleTitle = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return 'Quản trị viên';
            case 'ROLE_NURSE':
                return 'Y tá';
            case 'ROLE_PARENT':
                return 'Phụ huynh';
            default:
                return 'Người dùng';
        }
    };

    const getRoleIcon = (role) => {
        switch (role) {
            case 'ROLE_ADMIN':
                return '👨‍💼';
            case 'ROLE_NURSE':
                return '👩‍⚕️';
            case 'ROLE_PARENT':
                return '👪';
            default:
                return '👤';
        }
    };

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Toggle Button */}
            {onToggleCollapse && (
                <button
                    onClick={onToggleCollapse}
                    className="sidebar-toggle"
                >
                    {isCollapsed ? iconMap.chevronRight : iconMap.chevronLeft}
                </button>
            )}

            {/* Header */}
            <div className="sidebar-header">
                <div className="sidebar-header-content">
                    <div className="sidebar-logo">
                        <span className="sidebar-role-icon">{getRoleIcon(userRole)}</span>
                    </div>
                    {!isCollapsed && (
                        <div className="sidebar-title">
                            <h2 className="sidebar-school-name">Trường FPT</h2>
                            <p className="sidebar-role-title">{getRoleTitle(userRole)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                <ul className="sidebar-nav-list">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/thongke' && location.pathname.startsWith(item.path));

                        return (
                            <li key={item.path} className="sidebar-nav-item">
                                <Link
                                    to={item.path}
                                    onMouseEnter={() => setHoveredItem(item.path)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                                >
                                    <div className="sidebar-nav-content">
                                        <div className={`sidebar-nav-icon ${isActive ? 'active' : ''}`}>
                                            {iconMap[item.icon] || '📄'}
                                        </div>
                                        {!isCollapsed && (
                                            <span className="sidebar-nav-text">{item.name}</span>
                                        )}
                                    </div>

                                    {/* Badge */}
                                    {item.badge && (
                                        <span className={`sidebar-badge ${isCollapsed ? 'absolute' : ''}`}>
                      {item.badge}
                    </span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && hoveredItem === item.path && (
                                        <div className="sidebar-tooltip">
                                            {item.name}
                                            <div className="sidebar-tooltip-arrow"></div>
                                        </div>
                                    )}

                                    {/* Active indicator */}
                                    {isActive && (<div className="sidebar-active-indicator"></div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                {!isCollapsed ? (
                    <div className="sidebar-footer-expanded">
                        <div className="sidebar-footer-header">
                            <div className="sidebar-footer-icon">
                                <span>🏥</span>
                            </div>
                            <span className="sidebar-footer-text">Y tế trường học</span>
                        </div>
                        <p className="sidebar-footer-copyright">© {new Date().getFullYear()} Trường FPT</p>
                        <p className="sidebar-footer-system">Hệ thống quản lý y tế</p>
                    </div>
                ) : (
                    <div className="sidebar-footer-collapsed">
                        <div className="sidebar-footer-icon-small">
                            <span>🏥</span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;