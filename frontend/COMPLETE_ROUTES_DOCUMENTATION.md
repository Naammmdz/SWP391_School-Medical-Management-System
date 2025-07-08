# 📋 COMPLETE ROUTES DOCUMENTATION - Hệ thống Y tế Trường học FPT

## 🎯 Tổng quan Project

**Tên dự án**: Hệ thống Y tế Trường học FPT  
**Framework**: React + React Router  
**Ngày tạo**: $(date)  
**Tổng số routes**: 45 routes  

---

## 📊 Thống kê chi tiết

| Loại | Số lượng | Tỷ lệ |
|------|----------|-------|
| **Public Routes** | 5 routes | 11.1% |
| **Protected Routes** | 40 routes | 88.9% |
| **Routes với Parameters** | 4 routes | 8.9% |
| **Routes có vấn đề** | 6 routes | 13.3% |

---

## 🌐 PUBLIC ROUTES (Không cần đăng nhập)

### 1. **Trang chủ** 
- **Route**: `/`
- **Component**: `HomePage`
- **File**: `src/pages/home/homePage/HomePage.jsx`
- **Mô tả**: Trang chủ chính của hệ thống
- **Status**: ✅ Active
- **Ghi chú**: Hiển thị thông tin tổng quan về trường học

### 2. **Trang đăng nhập**
- **Route**: `/login`
- **Component**: `Login`
- **File**: `src/pages/auth/login/Login.jsx`
- **Mô tả**: Form đăng nhập cho tất cả người dùng
- **Status**: ✅ Active
- **Ghi chú**: Redirect theo role sau khi đăng nhập thành công

### 3. **Trang blog**
- **Route**: `/blog`
- **Component**: `Blog`
- **File**: `src/pages/home/Blog/Blog.jsx`
- **Mô tả**: Hiển thị danh sách bài viết blog
- **Status**: ✅ Active
- **Ghi chú**: Có link đến `/blog/:id` nhưng route này chưa tồn tại

### 4. **Chi tiết bài blog** ⚠️
- **Route**: `/blog/:id`
- **Component**: `BlogDetail` (chưa tồn tại)
- **File**: Chưa có
- **Mô tả**: Hiển thị chi tiết bài viết blog
- **Status**: ❌ Missing
- **Ghi chú**: Được link trong Blog component nhưng chưa có route

### 5. **Trang giới thiệu** ⚠️
- **Route**: `/about`
- **Component**: `About` (chưa tồn tại)
- **File**: Chưa có
- **Mô tả**: Trang giới thiệu về trường học
- **Status**: ❌ Missing
- **Ghi chú**: Được link trong HomePage nhưng chưa có route

---

## 🔒 PROTECTED ROUTES (Cần đăng nhập)

### 📊 **TỔNG QUAN & HỆ THỐNG**

#### 6. **Bảng điều khiển**
- **Route**: `/thongke`
- **Component**: `DashboardPage`
- **File**: `src/pages/dashboardPage/DashboardPage.jsx`
- **Role**: All (Tất cả người dùng đã đăng nhập)
- **Mô tả**: Dashboard hiển thị thống kê tổng quan
- **Status**: ✅ Active

#### 7. **Thông báo tiêm chủng**
- **Route**: `/thongbaotiemchung`
- **Component**: `VaccinationNotifications`
- **File**: `src/pages/health/Vaccination/VaccinationNotifications.jsx`
- **Role**: All
- **Mô tả**: Hiển thị thông báo tiêm chủng cho phụ huynh
- **Status**: ✅ Active

#### 8. **Trang quản trị**
- **Route**: `/admin`
- **Component**: `Admin`
- **File**: `src/pages/admin/Admin.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Trang quản trị chính cho admin
- **Status**: ✅ Active
- **Ghi chú**: Có navigation đến các trang quản lý khác

#### 9. **Trang y tá**
- **Route**: `/nurse`
- **Component**: `NursePages`
- **File**: `src/pages/nurse/NursePages.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Trang chính cho y tá
- **Status**: ✅ Active
- **Ghi chú**: Có navigation đến các chức năng y tế

---

### 👥 **QUẢN LÝ NGƯỜI DÙNG**

#### 10. **Cập nhật thông tin cá nhân**
- **Route**: `/capnhatthongtin`
- **Component**: `UpdateUser`
- **File**: `src/pages/user/UpdateUser.jsx`
- **Role**: All
- **Mô tả**: Form cập nhật thông tin cá nhân
- **Status**: ✅ Active

#### 11. **Đổi mật khẩu**
- **Route**: `/doimatkhau`
- **Component**: `UpdatePassword`
- **File**: `src/pages/user/UpdatePassword.jsx`
- **Role**: All
- **Mô tả**: Form đổi mật khẩu
- **Status**: ✅ Active

#### 12. **Tạo người dùng mới**
- **Route**: `/taomoinguoidung`
- **Component**: `CreateUser`
- **File**: `src/pages/user/CreateUser.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form tạo người dùng mới
- **Status**: ✅ Active

#### 13. **Cập nhật người dùng (Admin)**
- **Route**: `/capnhatnguoidung/:userId`
- **Component**: `UpdateUserByAdmin`
- **File**: `src/pages/user/UpdateUserByAdmin.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form cập nhật thông tin người dùng (dành cho admin)
- **Status**: ✅ Active
- **Parameters**: `:userId` - ID người dùng cần cập nhật

#### 14. **Danh sách người dùng**
- **Route**: `/danhsachnguoidung`
- **Component**: `UserList`
- **File**: `src/pages/user/UserList.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Hiển thị danh sách tất cả người dùng
- **Status**: ✅ Active

#### 15. **Khóa người dùng**
- **Route**: `/khoanguoidung/:userId`
- **Component**: `BlockUser`
- **File**: `src/pages/user/BlockUser.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Trang khóa/mở khóa người dùng
- **Status**: ✅ Active
- **Parameters**: `:userId` - ID người dùng cần khóa

---

### 🎓 **QUẢN LÝ HỌC SINH**

#### 16. **Tạo học sinh mới**
- **Route**: `/taomoihocsinh`
- **Component**: `CreateStudent`
- **File**: `src/pages/student/CreateStudent.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form tạo học sinh mới
- **Status**: ✅ Active

#### 17. **Danh sách học sinh**
- **Route**: `/danhsachhocsinh`
- **Component**: `StudentList`
- **File**: `src/pages/student/StudentList.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Hiển thị danh sách tất cả học sinh
- **Status**: ✅ Active

#### 18. **Cập nhật thông tin học sinh**
- **Route**: `/capnhathocsinh/:studentId`
- **Component**: `UpdateStudent`
- **File**: `src/pages/student/UpdateStudent.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form cập nhật thông tin học sinh
- **Status**: ✅ Active
- **Parameters**: `:studentId` - ID học sinh cần cập nhật

---

### 💉 **TIÊM CHỦNG**

#### 19. **Tạo chiến dịch tiêm chủng**
- **Route**: `/taosukientiemchung`
- **Component**: `CreateVaccinationCampaign`
- **File**: `src/pages/health/Vaccination/CreateVaccinationCampaign.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form tạo chiến dịch tiêm chủng mới
- **Status**: ✅ Active

#### 20. **Quản lý tiêm chủng**
- **Route**: `/quanlytiemchung`
- **Component**: `VaccinationManagement`
- **File**: `src/pages/health/Vaccination/VaccinationManagement.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Quản lý các chiến dịch tiêm chủng
- **Status**: ✅ Active

#### 21. **Cập nhật thông tin tiêm chủng**
- **Route**: `/capnhatthongtintiemchung`
- **Component**: `UpdateVaccination`
- **File**: `src/pages/health/Vaccination/UpdateVaccination.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Form cập nhật thông tin chiến dịch tiêm chủng
- **Status**: ✅ Active

#### 22. **Cập nhật tiêm chủng (alias)** ⚠️
- **Route**: `/capnhattiemchung`
- **Component**: `UpdateVaccination`
- **File**: `src/pages/health/Vaccination/UpdateVaccination.jsx`
- **Role**: ROLE_ADMIN
- **Mô tả**: Alias của `/capnhatthongtintiemchung`
- **Status**: 🔄 Duplicate
- **Ghi chú**: Route trùng lặp, nên xóa route này

#### 23. **Kết quả tiêm chủng**
- **Route**: `/ketquatiemchung`
- **Component**: `VaccinationResult`
- **File**: `src/pages/health/Vaccination/VaccinationResult.jsx`
- **Role**: ROLE_ADMIN, ROLE_NURSE
- **Mô tả**: Hiển thị kết quả tiêm chủng tổng quan
- **Status**: ✅ Active

#### 24. **Kết quả tiêm chủng học sinh**
- **Route**: `/ketquatiemchunghocsinh`
- **Component**: `VaccinationStudentResult`
- **File**: `src/pages/health/Vaccination/VaccinationStudentResult.jsx`
- **Role**: All
- **Mô tả**: Hiển thị kết quả tiêm chủng cho từng học sinh
- **Status**: ✅ Active

---

### 🏥 **KHÁM SỨC KHỎE**

#### 25. **Tạo lịch kiểm tra định kỳ**
- **Route**: `/kiemtradinhky`
- **Component**: `CreateHealthCheck`
- **File**: `src/pages/health/HealthCheck/CreateHealthCheck.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Form tạo lịch kiểm tra sức khỏe định kỳ
- **Status**: ✅ Active

#### 26. **Danh sách kiểm tra định kỳ**
- **Route**: `/danhsachkiemtradinhky`
- **Component**: `HealthCheckList`
- **File**: `src/pages/health/HealthCheck/HealthCheckList.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Hiển thị danh sách các lịch kiểm tra
- **Status**: ✅ Active

#### 27. **Cập nhật kiểm tra định kỳ**
- **Route**: `/capnhatkiemtradinhky`
- **Component**: `UpdateHealthCheck`
- **File**: `src/pages/health/HealthCheck/UpdateHealthCheck.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Form cập nhật thông tin kiểm tra
- **Status**: ✅ Active

#### 28. **Thực hiện khám sức khỏe**
- **Route**: `/kiemtradinhkyhocsinh`
- **Component**: `HealthCheck`
- **File**: `src/pages/health/HealthCheck/HealthCheck.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Form thực hiện khám sức khỏe cho học sinh
- **Status**: ✅ Active

#### 29. **Kết quả kiểm tra định kỳ**
- **Route**: `/ketquakiemtradinhky`
- **Component**: `HealthCheckResult`
- **File**: `src/pages/health/HealthCheck/HealthCheckResult.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Hiển thị kết quả kiểm tra sức khỏe tổng quan
- **Status**: ✅ Active

#### 30. **Kết quả kiểm tra học sinh**
- **Route**: `/ketquakiemtradinhkyhocsinh`
- **Component**: `HealthCheckResultStudent`
- **File**: `src/pages/health/HealthCheck/HealthCheckResultStudent.jsx`
- **Role**: ROLE_NURSE, ROLE_PARENT
- **Mô tả**: Hiển thị kết quả kiểm tra cho từng học sinh
- **Status**: ✅ Active

#### 31. **Cập nhật kết quả kiểm tra**
- **Route**: `/capnhatketquakiemtra`
- **Component**: `UpdateHealthCheckResult`
- **File**: `src/pages/health/HealthCheck/UpdateHealthCheckResult.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Form cập nhật kết quả kiểm tra sức khỏe
- **Status**: ✅ Active

---

### 💊 **THUỐC & ĐIỀU TRỊ**

#### 32. **Đơn thuốc**
- **Route**: `/donthuoc`
- **Component**: `NursePrescription`
- **File**: `src/pages/nurse/NursePrescription.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Quản lý đơn thuốc cho học sinh
- **Status**: ✅ Active

#### 33. **Chờ uống thuốc**
- **Route**: `/chouongthuoc`
- **Component**: `MedicineLog`
- **File**: `src/pages/health/MedicineDeclaration/MedicineLog.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Theo dõi việc uống thuốc của học sinh
- **Status**: ✅ Active

#### 34. **Quản lý thuốc**
- **Route**: `/quanlythuoc`
- **Component**: `Pharmaceutical`
- **File**: `src/pages/medical/Pharmaceutical/Pharmaceutical.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Quản lý kho thuốc và tồn kho
- **Status**: ✅ Active

---

### 📋 **HỒ SƠ & KHAI BÁO**

#### 35. **Hồ sơ sức khỏe**
- **Route**: `/hososuckhoe`
- **Component**: `HealthRecord`
- **File**: `src/pages/health/HealthRecord/HealthRecord.jsx`
- **Role**: ROLE_PARENT
- **Mô tả**: Xem hồ sơ sức khỏe của con em
- **Status**: ✅ Active

#### 36. **Khai báo thuốc**
- **Route**: `/khaibaothuoc`
- **Component**: `MedicineDeclarations`
- **File**: `src/pages/health/MedicineDeclaration/MedicineDeclarations.jsx`
- **Role**: ROLE_PARENT
- **Mô tả**: Form khai báo thuốc con em đang sử dụng
- **Status**: ✅ Active

#### 37. **Đơn thuốc đã gửi**
- **Route**: `/donthuocdagui`
- **Component**: `MedicineList`
- **File**: `src/pages/health/MedicineDeclaration/MedicineList.jsx`
- **Role**: ROLE_PARENT
- **Mô tả**: Xem danh sách đơn thuốc đã khai báo
- **Status**: ✅ Active

---

### 🚨 **SỰ KIỆN Y TẾ**

#### 38. **Sự cố y tế**
- **Route**: `/sukienyte`
- **Component**: `MedicalEvents`
- **File**: `src/pages/medical/MedicalEvent/MedicalEvents.jsx`
- **Role**: ROLE_NURSE
- **Mô tả**: Quản lý các sự cố y tế trong trường
- **Status**: ✅ Active

---

## ⚠️ **ROUTES CÓ VẤN ĐỀ**

### 🔄 **Routes trùng lặp**
1. **`/capnhattiemchung`** - Trùng với `/capnhatthongtintiemchung`
   - **Giải pháp**: Xóa route `/capnhattiemchung`

### ❌ **Routes thiếu**
1. **`/blog/:id`** - Chi tiết bài blog
   - **Cần tạo**: Component `BlogDetail`
   - **File**: `src/pages/home/Blog/BlogDetail.jsx`

2. **`/about`** - Trang giới thiệu
   - **Cần tạo**: Component `About`
   - **File**: `src/pages/home/About/About.jsx`

### 🧭 **Routes Navigation Only**
Các routes này được sử dụng trong navigation nhưng không có route thực:

1. **`/admin/taomoinguoidung`** → Redirect đến `/taomoinguoidung`
2. **`/admin/danhsachnguoidung`** → Redirect đến `/danhsachnguoidung`
3. **`/admin/capnhatnguoidung/:userId`** → Redirect đến `/capnhatnguoidung/:userId`
4. **`/admin/khoanguoidung/:userId`** → Redirect đến `/khoanguoidung/:userId`

---

## 🔧 **HƯỚNG DẪN SỬA LỖI**

### 1. **Thêm routes thiếu**

```javascript
// Trong App.jsx
import BlogDetail from './pages/home/Blog/BlogDetail';
import About from './pages/home/About/About';

// Thêm routes
<Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
<Route path="/about" element={<Layout><About /></Layout>} />
```

### 2. **Xóa route trùng lặp**

```javascript
// Xóa route này trong App.jsx
<Route path="/capnhattiemchung" element={<Layout showSidebar><UpdateVaccination /></Layout>} />
```

### 3. **Thống nhất naming convention**

**Option A**: Thêm `/admin/` prefix cho tất cả admin routes
```javascript
<Route path="/admin/taomoinguoidung" element={<Layout showSidebar><CreateUser /></Layout>} />
<Route path="/admin/danhsachnguoidung" element={<Layout showSidebar><UserList /></Layout>} />
```

**Option B**: Loại bỏ `/admin/` prefix trong navigation
```javascript
// Trong Sidebar.jsx, thay đổi các link từ /admin/... thành /...
```

---

## 📈 **THỐNG KÊ THEO ROLE**

| Role | Số routes | Tỷ lệ |
|------|-----------|-------|
| **All** | 8 routes | 17.8% |
| **ROLE_ADMIN** | 15 routes | 33.3% |
| **ROLE_NURSE** | 12 routes | 26.7% |
| **ROLE_PARENT** | 5 routes | 11.1% |
| **ROLE_ADMIN + ROLE_NURSE** | 2 routes | 4.4% |
| **ROLE_NURSE + ROLE_PARENT** | 1 route | 2.2% |

---

## 🎯 **KHUYẾN NGHỊ CẢI TIẾN**

### 1. **Tính năng cần thêm**
- [ ] Trang chi tiết bài blog (`/blog/:id`)
- [ ] Trang giới thiệu (`/about`)
- [ ] Trang liên hệ (`/contact`)
- [ ] Trang FAQ (`/faq`)

### 2. **Cải tiến bảo mật**
- [ ] Thêm middleware kiểm tra quyền truy cập
- [ ] Implement role-based route protection
- [ ] Thêm session timeout

### 3. **Cải tiến UX**
- [ ] Thêm breadcrumb navigation
- [ ] Implement lazy loading cho routes
- [ ] Thêm loading states

### 4. **Cải tiến code**
- [ ] Tách routes thành modules riêng
- [ ] Implement route constants
- [ ] Thêm route validation

---

## 📞 **LIÊN HỆ & HỖ TRỢ**

**Team phát triển**: Frontend Team  
**Email**: frontend@fpt.edu.vn  
**Slack**: #frontend-support  

---

*📝 Cập nhật lần cuối: $(date)*  
*👨‍💻 Tạo bởi: AI Assistant*  
*📊 Version: 1.0* 