import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  { path: '/admin/danhsachnguoidung', name: 'Quản lý người dùng', icon: 'users', roles: ['ROLE_ADMIN'] },
  { path: '/admin/taomoinguoidung', name: 'Tạo người dùng', icon: 'users', roles: ['ROLE_ADMIN'] },
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
    ]
  },
];

const Sidebar = ({ userRole, onToggleCollapse, className = "" }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openGroup, setOpenGroup] = useState(0); // Mặc định mở nhóm đầu tiên
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

  useEffect(() => {
    if (user.userRole === "ROLE_PARENT" && token) {
      console.log("Fetching students for parent:", user.userId);
      console.log("Token:", token);
      
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      studentService.getStudentByParentID(user.userId, config)
        .then((res) => {
          console.log("Students response:", res);
          setStudentList(Array.isArray(res.data) ? res.data : []);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
          console.error("Error response:", error.response);
          setStudentList([]);
        });
    } else {
      console.log("User role or token missing:", { userRole: user.userRole, hasToken: !!token });
    }
  }, [user.userRole, user.userId, token]);

  const handleToggleGroup = (idx) => {
    setOpenGroup(openGroup === idx ? -1 : idx);
  };

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

  const handleSelectStudent = (e) => {
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
  };
  

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
        {navGroups.map((group, idx) => {
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
                  onMouseEnter={() => setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
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

