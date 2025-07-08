# 📋 Routes Inventory - Hệ thống Y tế Trường học FPT

## 📁 File: `routes_inventory.csv`

File này chứa tổng hợp đầy đủ tất cả routes trong project React của hệ thống y tế trường học.

## 🗂️ Cách mở file CSV trong Excel

1. **Mở Excel**
2. **File → Open** hoặc **Ctrl + O**
3. Chọn file `routes_inventory.csv`
4. Excel sẽ tự động nhận diện định dạng CSV
5. Hoặc có thể **Copy & Paste** nội dung vào Excel

## 📊 Cấu trúc dữ liệu

| Cột | Mô tả | Ví dụ |
|-----|-------|-------|
| **Category** | Nhóm phân loại routes | Public Routes, Protected Routes - Overview |
| **Route** | Đường dẫn URL | `/`, `/login`, `/admin` |
| **Component** | Component React tương ứng | `HomePage`, `Login`, `Admin` |
| **Role** | Role được phép truy cập | `All`, `ROLE_ADMIN`, `ROLE_NURSE` |
| **Description** | Mô tả chức năng | Trang chủ, Trang đăng nhập |
| **Status** | Trạng thái route | `Active`, `Missing`, `Duplicate` |
| **Notes** | Ghi chú bổ sung | Mô tả vấn đề hoặc lưu ý |

## 📈 Thống kê tổng quan

- **Tổng số routes**: 45 routes
- **Public routes**: 5 routes (3 Active, 2 Missing)
- **Protected routes**: 40 routes
- **Routes với parameters**: 4 routes (`:userId`, `:studentId`)
- **Routes có vấn đề**: 6 routes (Missing, Duplicate, Navigation Only)

## ⚠️ Vấn đề cần xử lý

### 1. **Routes thiếu (Missing)**
- `/blog/:id` - Chi tiết bài blog
- `/about` - Trang giới thiệu

### 2. **Routes trùng lặp (Duplicate)**
- `/capnhattiemchung` - Trùng với `/capnhatthongtintiemchung`

### 3. **Routes chỉ có trong Navigation (Navigation Only)**
- `/admin/taomoinguoidung`
- `/admin/danhsachnguoidung`
- `/admin/capnhatnguoidung/:userId`
- `/admin/khoanguoidung/:userId`

## 🔧 Hướng dẫn sử dụng

### **Lọc dữ liệu trong Excel**
1. Chọn toàn bộ dữ liệu
2. **Data → Filter**
3. Sử dụng dropdown để lọc theo:
   - **Category**: Xem routes theo nhóm chức năng
   - **Role**: Xem routes theo quyền truy cập
   - **Status**: Xem routes có vấn đề cần xử lý

### **Tìm kiếm nhanh**
- **Ctrl + F**: Tìm kiếm theo route hoặc component
- **Ctrl + H**: Thay thế text

### **Sắp xếp dữ liệu**
- Click vào header cột để sắp xếp
- **Data → Sort**: Sắp xếp theo nhiều tiêu chí

## 📝 Ghi chú quan trọng

### **Role Access**
- `All`: Tất cả người dùng đã đăng nhập
- `ROLE_ADMIN`: Chỉ Admin
- `ROLE_NURSE`: Chỉ Y tá
- `ROLE_PARENT`: Chỉ Phụ huynh
- `ROLE_ADMIN;ROLE_NURSE`: Admin và Y tá

### **Status Codes**
- `Active`: Route hoạt động bình thường
- `Missing`: Route chưa được định nghĩa trong App.jsx
- `Duplicate`: Route trùng lặp
- `Navigation Only`: Chỉ có trong navigation, không có route thực

## 🚀 Cải tiến đề xuất

1. **Thêm routes thiếu**:
   ```javascript
   <Route path="/blog/:id" element={<Layout><BlogDetail /></Layout>} />
   <Route path="/about" element={<Layout><About /></Layout>} />
   ```

2. **Loại bỏ routes trùng lặp**:
   - Xóa `/capnhattiemchung`

3. **Thống nhất naming convention**:
   - Thêm `/admin/` prefix cho tất cả admin routes
   - Hoặc loại bỏ `/admin/` prefix trong navigation

4. **Cập nhật file định kỳ**:
   - Khi thêm routes mới
   - Khi thay đổi component
   - Khi cập nhật role access

## 📞 Liên hệ

Nếu có thắc mắc về routes hoặc cần hỗ trợ, vui lòng liên hệ team phát triển.

---
*Cập nhật lần cuối: $(date)* 