
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';
import {
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  SettingOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  HeartOutlined,
  SolutionOutlined,
  TeamOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  SafetyOutlined,
  FolderOpenOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import studentService from '../services/StudentService';
import axios from "axios";

// Icons - sử dụng emoji hoặc text thay thế lucide-react
const iconMap = {
  home: <HomeOutlined />,
  users: <TeamOutlined />,
  bell: <BellOutlined />,
  settings: <SettingOutlined />,
  stethoscope: <MedicineBoxOutlined />,
  pill: <MedicineBoxOutlined />,
  clipboard: <FileTextOutlined />,
  heart: <HeartOutlined />,
  briefcase: <SolutionOutlined />,
  activity: <BarChartOutlined />,
  syringe: <MedicineBoxOutlined />,
  chevronLeft: <ArrowLeftOutlined style={{fontSize: 18}} />,
  chevronRight: <ArrowRightOutlined style={{fontSize: 18}} />,
  bookUser: <UserOutlined />,
  barChart: <BarChartOutlined />,
  calendar: <CalendarOutlined />,
  report: <FileDoneOutlined />,
  shield: <SafetyOutlined />,
  archive: <FolderOpenOutlined />,
};

// Role-specific navigation configurations
const getNavGroupsForRole = (role) => {
  const commonGroups = {
    overview: {
      title: 'Tổng quan & Hệ thống',
      items: [
        { path: '/thongke', name: 'Bảng điều khiển', icon: 'home' },
        { path: '/thongbaotiemchung', name: 'Thông báo', icon: 'bell', badge: '3' },
      ]
    }
  };

  const roleSpecificGroups = {
    ROLE_ADMIN: [
      {
        ...commonGroups.overview,
        items: [
          ...commonGroups.overview.items,
          { path: '/admin', name: 'Quản trị hệ thống', icon: 'settings' },
        ]
      },
      {
        title: 'Quản lý người dùng',
        items: [
          { path: '/danhsachnguoidung', name: 'Danh sách người dùng', icon: 'users' },
          { path: '/taomoinguoidung', name: 'Tạo người dùng mới', icon: 'users' },
          { path: '/capnhatnguoidung', name: 'Cập nhật người dùng', icon: 'users' },
          { path: '/khoanguoidung', name: 'Khóa người dùng', icon: 'shield' },
        ]
      },
      {
        title: 'Quản lý học sinh',
        items: [
          { path: '/danhsachhocsinh', name: 'Danh sách học sinh', icon: 'bookUser' },
          { path: '/taomoihocsinh', name: 'Thêm học sinh mới', icon: 'bookUser' },
          { path: '/capnhathocsinh', name: 'Cập nhật học sinh', icon: 'bookUser' },
        ]
      },
      {
        title: 'Tiêm chủng',
        items: [
          { path: '/taosukientiemchung', name: 'Tạo chiến dịch tiêm chủng', icon: 'syringe' },
          { path: '/quanlytiemchung', name: 'Quản lý tiêm chủng', icon: 'syringe' },
          { path: '/capnhatthongtintiemchung', name: 'Cập nhật thông tin tiêm chủng', icon: 'syringe' },
          { path: '/capnhattiemchung', name: 'Cập nhật tiêm chủng', icon: 'syringe' },
          { path: '/ketquatiemchung', name: 'Kết quả tiêm chủng', icon: 'report' },
          { path: '/ketquatiemchunghocsinh', name: 'Kết quả tiêm chủng học sinh', icon: 'report' },
        ]
      },
      {
        title: 'Khám sức khỏe',
        items: [
          { path: '/kiemtradinhky', name: 'Tạo kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/danhsachkiemtradinhky', name: 'Danh sách kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/capnhatkiemtradinhky', name: 'Cập nhật kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/kiemtradinhkyhocsinh', name: 'Kiểm tra định kỳ học sinh', icon: 'stethoscope' },
          { path: '/ketquakiemtradinhky', name: 'Kết quả kiểm tra định kỳ', icon: 'report' },
          { path: '/ketquakiemtradinhkyhocsinh', name: 'Kết quả kiểm tra học sinh', icon: 'report' },
          { path: '/capnhatketquakiemtra', name: 'Cập nhật kết quả kiểm tra', icon: 'report' },
        ]
      },
      {
        title: 'Y tế & Thuốc',
        items: [
          { path: '/sukienyte', name: 'Sự kiện y tế', icon: 'activity' },
          { path: '/quanlythuoc', name: 'Quản lý thuốc', icon: 'pill' },
          { path: '/khaibaothuoc', name: 'Khai báo thuốc', icon: 'briefcase' },
          { path: '/donthuocdagui', name: 'Đơn thuốc đã gửi', icon: 'clipboard' },
        ]
      }
    ],
    ROLE_NURSE: [
      {
        ...commonGroups.overview,
        items: [
          ...commonGroups.overview.items,
          { path: '/nurse', name: 'Trang Y tá', icon: 'stethoscope' },
        ]
      },
      {
        title: 'Khám sức khỏe',
        items: [
          { path: '/kiemtradinhky', name: 'Tạo kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/danhsachkiemtradinhky', name: 'Danh sách kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/capnhatkiemtradinhky', name: 'Cập nhật kiểm tra định kỳ', icon: 'stethoscope' },
          { path: '/kiemtradinhkyhocsinh', name: 'Kiểm tra định kỳ học sinh', icon: 'stethoscope' },
          { path: '/ketquakiemtradinhky', name: 'Kết quả kiểm tra định kỳ', icon: 'report' },
          { path: '/ketquakiemtradinhkyhocsinh', name: 'Kết quả kiểm tra học sinh', icon: 'report' },
          { path: '/capnhatketquakiemtra', name: 'Cập nhật kết quả kiểm tra', icon: 'report' },
        ]
      },
      {
        title: 'Y tế & Điều trị',
        items: [
          { path: '/donthuoc', name: 'Đơn thuốc', icon: 'clipboard', badge: '2' },
          { path: '/sukienyte', name: 'Sự kiện y tế', icon: 'activity', badge: '1' },
          { path: '/quanlythuoc', name: 'Quản lý thuốc', icon: 'pill' },
          { path: '/chouongthuoc', name: 'Chờ uống thuốc', icon: 'pill' },
        ]
      },
      {
        title: 'Tiêm chủng',
        items: [
          { path: '/quanlytiemchung', name: 'Quản lý tiêm chủng', icon: 'syringe' },
          { path: '/capnhatthongtintiemchung', name: 'Cập nhật thông tin tiêm chủng', icon: 'syringe' },
          { path: '/capnhattiemchung', name: 'Cập nhật tiêm chủng', icon: 'syringe' },
          { path: '/ketquatiemchung', name: 'Kết quả tiêm chủng', icon: 'report' },
          { path: '/ketquatiemchunghocsinh', name: 'Kết quả tiêm chủng học sinh', icon: 'report' },
        ]
      },
      {
        title: 'Khai báo thuốc',
        items: [
          { path: '/khaibaothuoc', name: 'Khai báo thuốc', icon: 'briefcase' },
          { path: '/donthuocdagui', name: 'Đơn thuốc đã gửi', icon: 'clipboard' },
        ]
      }
    ],
    ROLE_PARENT: [
      commonGroups.overview,
      {
        title: 'Hồ sơ sức khỏe',
        items: [
          { path: '/hososuckhoe', name: 'Hồ sơ sức khỏe', icon: 'heart' },
        ]
      },
      {
        title: 'Khai báo & Đơn thuốc',
        items: [
          { path: '/khaibaothuoc', name: 'Khai báo thuốc', icon: 'briefcase' },
          { path: '/donthuocdagui', name: 'Đơn thuốc đã gửi', icon: 'clipboard' },
          { path: '/chouongthuoc', name: 'Chờ uống thuốc', icon: 'pill' },
        ]
      },
      {
        title: 'Kết quả sức khỏe',
        items: [
          { path: '/ketquakiemtradinhkyhocsinh', name: 'Kết quả kiểm tra sức khỏe', icon: 'report' },
          { path: '/ketquatiemchunghocsinh', name: 'Kết quả tiêm chủng', icon: 'report' },
        ]
      },
      {
        title: 'Cài đặt tài khoản',
        items: [
          { path: '/capnhatthongtin', name: 'Cập nhật thông tin', icon: 'users' },
          { path: '/doimatkhau', name: 'Đổi mật khẩu', icon: 'shield' },
        ]
      }
    ]
  };

  return roleSpecificGroups[role] || [];
};

// Legacy support - will be removed in future versions
const navGroups = [
  {
    title: 'Tổng quan & Hệ thống',
    items: [
      { path: '/thongke', name: 'Bảng điều khiển', icon: 'home', roles: ['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PARENT'] },
      { path: '/thongbaotiemchung', name: 'Thông báo', icon: 'bell', badge: '3', roles: ['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PARENT'] },
      { path: '/admin', name: 'Quản trị hệ thống', icon: 'settings', roles: ['ROLE_ADMIN'] },
      { path: '/nurse', name: 'Trang Y tá', icon: 'stethoscope', roles: ['ROLE_NURSE'] },
    ]
  },
  {
    title: 'Người dùng',
    items: [
      { path: '/danhsachnguoidung', name: 'Quản lý người dùng', icon: 'users', roles: ['ROLE_ADMIN'] },
      { path: '/taomoinguoidung', name: 'Tạo người dùng', icon: 'users', roles: ['ROLE_ADMIN'] },
    ]
  },
  {
    title: 'Học sinh',
    items: [
      { path: '/danhsachhocsinh', name: 'Quản lý học sinh', icon: 'bookUser', roles: ['ROLE_ADMIN'] },
      { path: '/taomoihocsinh', name: 'Tạo học sinh', icon: 'bookUser', roles: ['ROLE_ADMIN'] },
    ]
  },
  {
    title: 'Chiến dịch tiêm chủng',
    items: [
      { path: '/taosukientiemchung', name: 'Tạo chiến dịch tiêm chủng', icon: 'syringe', roles: ['ROLE_ADMIN'] },
      { path: '/quanlytiemchung', name: 'Quản lý tiêm chủng', icon: 'syringe', roles: ['ROLE_ADMIN'] },
    ]
  },
  {
    title: 'Khám sức khỏe',
    items: [
      { path: '/kiemtradinhky', name: 'Tạo kiểm tra định kỳ', icon: 'stethoscope', roles: ['ROLE_NURSE'] },
      { path: '/danhsachkiemtradinhky', name: 'Danh sách kiểm tra', icon: 'stethoscope', roles: ['ROLE_NURSE'] },
      { path: '/kiemtradinhkyhocsinh', name: 'Khám sức khỏe', icon: 'stethoscope', roles: ['ROLE_NURSE'] },
    ]
  },
  {
    title: 'Đơn thuốc & Sự kiện',
    items: [
      { path: '/donthuoc', name: 'Đơn thuốc', icon: 'clipboard', badge: '2', roles: ['ROLE_NURSE'] },
      { path: '/sukienyte', name: 'Sự cố y tế', icon: 'activity', badge: '1', roles: ['ROLE_NURSE'] },
      { path: '/quanlythuoc', name: 'Quản lý thuốc', icon: 'pill', roles: ['ROLE_NURSE'] },
    ]
  },
  {
    title: 'Hồ sơ & Khai báo',
    items: [
      { path: '/hososuckhoe', name: 'Hồ sơ sức khỏe', icon: 'heart', roles: ['ROLE_PARENT'] },
      { path: '/khaibaothuoc', name: 'Khai báo thuốc', icon: 'briefcase', roles: ['ROLE_PARENT'] },
      { path: '/donthuocdagui', name: 'Đơn thuốc đã gửi', icon: 'clipboard', roles: ['ROLE_PARENT'] },
    ]
  },
];

const Sidebar = ({ userRole, onToggleCollapse, className = "" }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openGroup, setOpenGroup] = useState(-1); // Will be set based on current URL
  const [hasInitialized, setHasInitialized] = useState(false); // Track if we've done initial setup
  const listRefs = useRef([]);
  const [listHeights, setListHeights] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState(localStorage.getItem("selectedStudentId") || "");
  // const user = JSON.parse(localStorage.getItem("user") || "{}");
  // const token = localStorage.getItem("token");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const token = useMemo(() => localStorage.getItem("token"), []);

  useEffect(() => {
    setListHeights(listRefs.current.map(ref => ref ? ref.scrollHeight : 0));
  }, []);

  // Get navigation groups based on user role  
  const currentNavGroups = useMemo(() => {
    // Use the new role-based navigation system
    return getNavGroupsForRole(userRole);
  }, [userRole]);

  // Effect to set the correct open group based on current URL
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Find which group contains the current active item
    const activeGroupIndex = currentNavGroups.findIndex(group => {
      const visibleItems = group.items.filter(item => !item.roles || item.roles.includes(userRole));
      return visibleItems.some(item => {
        // Exact match first
        if (currentPath === item.path) {
          return true;
        }
        
        // For nested routes, check if current path starts with item path
        // But avoid false positives (e.g., /admin matching /admin/something)
        if (item.path !== '/' && item.path !== '/thongke' && currentPath.startsWith(item.path)) {
          // Ensure it's a proper nested route (next character should be / or end of string)
          const nextChar = currentPath[item.path.length];
          return !nextChar || nextChar === '/' || nextChar === '?';
        }
        
        // Special handling for vaccination management routes
        if (item.path === '/quanlytiemchung' && (
          currentPath.startsWith('/capnhattiemchung') ||
          currentPath.startsWith('/chitiettiem') ||
          currentPath.startsWith('/ketquatiemchung')
        )) {
          return true;
        }
        
        // Special handling for health check routes
        if (item.path === '/danhsachkiemtradinhky' && (
          currentPath.startsWith('/capnhatkiemtra') ||
          currentPath.startsWith('/chitiettiem') ||
          currentPath.startsWith('/ketquakiemtra')
        )) {
          return true;
        }
        
        // Special handling for medicine declaration routes
        if (item.path === '/khaibaothuoc' && (
          currentPath.startsWith('/donthuocdagui') ||
          currentPath.startsWith('/chouongthuoc')
        )) {
          return true;
        }
        
        return false;
      });
    });
    
    // Only change sidebar state when:
    // 1. We found an active item in sidebar, OR
    // 2. This is the first load and we need to set a default
    if (activeGroupIndex !== -1) {
      // Found active item in sidebar - open its group
      setOpenGroup(activeGroupIndex);
      setHasInitialized(true);
    } else if (!hasInitialized) {
      // First time load - set default only if we haven't initialized yet
      if (currentNavGroups.length > 0) {
        setOpenGroup(0);
      }
      setHasInitialized(true);
    }
    // IMPORTANT: If activeGroupIndex === -1 AND hasInitialized === true,
    // do NOTHING - keep current sidebar state unchanged
    // This prevents sidebar from changing when clicking external links
  }, [location.pathname, userRole, currentNavGroups, hasInitialized]);

  useEffect(() => {
    if (user.userRole === "ROLE_PARENT" && token) {
      
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      studentService.getStudentByParentID(user.userId, config)
        .then((res) => {
          setStudentList(Array.isArray(res.data) ? res.data : []);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          setStudentList([]);
        });
    }
  }, [user.userRole, user.userId, token]);

  const handleToggleGroup = useCallback((idx) => {
    setOpenGroup(openGroup === idx ? -1 : idx);
  }, [openGroup]);

  const getRoleTitle = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'Quản trị viên';
      case 'ROLE_NURSE': return 'Y tá';
      case 'ROLE_PARENT': return 'Phụ huynh';
      default: return 'Người dùng';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return '👨‍💼';
      case 'ROLE_NURSE': return '👩‍⚕️';
      case 'ROLE_PARENT': return '👪';
      default: return '👤';
    }
  };

  const handleSelectStudent = useCallback((e) => {
    const studentId = e.target.value;
  
    setSelectedStudentId(studentId);
    localStorage.setItem("selectedStudentId", studentId);
  
    const selectedStudent = studentList.find(
      (student) => String(student.studentId) === String(studentId)
    );
  
    if (selectedStudent) {
      localStorage.setItem("selectedStudentInfo", JSON.stringify(selectedStudent));
    }
  
    // Lưu danh sách học sinh hiện tại vào localStorage (nếu chưa lưu ở nơi khác)
    localStorage.setItem("students", JSON.stringify(studentList));
  
    window.location.reload(); // nếu muốn reload các trang khác dùng student mới
  }, [studentList]);

  const handleMouseEnter = useCallback((path) => {
    setHoveredItem(path);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);
  

  return (
    <aside className={`sidebar ${className}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-header-content">
          <div className="sidebar-logo">
            <span className="sidebar-role-icon">{getRoleIcon(userRole)}</span>
          </div>
            <div className="sidebar-title">
              <h2 className="sidebar-school-name">Trường FPT</h2>
              <p className="sidebar-role-title">{getRoleTitle(userRole)}</p>
            </div>
        </div>
      </div>

      {/* Chọn học sinh cho phụ huynh */}
      {userRole === 'ROLE_PARENT' && (
        <div style={{padding: '16px 16px 0 16px'}}>
          <label style={{fontWeight: 600, fontSize: 14, marginBottom: 6, display: 'block'}}>Chọn học sinh:</label>
          <select
            value={selectedStudentId}
            onChange={handleSelectStudent}
            style={{width: '100%', padding: 6, borderRadius: 6, border: '1px solid #eee'}}>
            <option value="">-- Chọn học sinh --</option>
            {studentList.map(student => (
              <option key={student.studentId} value={student.studentId}>{student.fullName} ({student.className})</option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        {currentNavGroups.map((group, idx) => {
          // Filter items based on user role - needed for legacy navigation
          const visibleItems = group.items.filter(item => !item.roles || item.roles.includes(userRole));
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.title} className="sidebar-group">
              <div className="sidebar-group-title" onClick={() => handleToggleGroup(idx)} style={{cursor: 'pointer', userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <span>{group.title}</span>
                <span style={{fontSize: 16, marginLeft: 8}}>{openGroup === idx ? iconMap.chevronDown || '▼' : iconMap.chevronRight}</span>
              </div>
              {(openGroup === idx) && (
                <ul
                  className="sidebar-nav-list"
                  ref={el => listRefs.current[idx] = el}
                  style={openGroup === idx ? {height: listHeights[idx] || 'auto'} : {height: 0, padding: 0, margin: 0, opacity: 0.5, pointerEvents: 'none', overflow: 'hidden'}}
                >
                  {visibleItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path !== '/thongke' && location.pathname.startsWith(item.path));
                    const isBackHome = item.path === '/';
                    const isDisabled = userRole === 'ROLE_PARENT' && !selectedStudentId && !isBackHome;
            return (
                      <li key={item.path} className={`sidebar-nav-item${isDisabled ? ' disabled' : ''}`}
                        style={isDisabled ? {pointerEvents: 'none', opacity: 0.5} : {}}>
                <Link
                  to={item.path}
                  onMouseEnter={() => handleMouseEnter(item.path)}
                  onMouseLeave={handleMouseLeave}
                  className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                >
                  <div className="sidebar-nav-content">
                            <div className={`sidebar-nav-icon ${isActive ? 'active' : ''}`}>{iconMap[item.icon] || iconMap['fileText']}</div>
                      <span className="sidebar-nav-text">{item.name}</span>
                  </div>
                  {/* Badge */}
                  {item.badge && (
                            <span className={`sidebar-badge`}>{item.badge}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Back to Homepage ở cuối */}
      <div className="sidebar-back-home">
        <Link to="/" className="sidebar-nav-link">
          <div className="sidebar-nav-content">
            <ArrowLeftOutlined style={{fontSize: 20}} />
            <span className="sidebar-nav-text">Trang chủ</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      {/* <div className="sidebar-footer">
        {!isCollapsed ? (
          <div className="sidebar-footer-expanded">
            <div className="sidebar-footer-header">
              <div className="sidebar-footer-icon">
                <span>🏥</span>
              </div>
              <span className="sidebar-footer-text">Y tế trường học</span>
            </div>
            <p className="sidebar-footer-copyright">© {new Date().getFullYear()} Trường FPT</p>
          </div>
        ) : (
          <div className="sidebar-footer-collapsed">
            <div className="sidebar-footer-icon-small">
              <span>🏥</span>
            </div>
          </div>
        )}
      </div> */}
    </aside>
  );
};

export default Sidebar;


