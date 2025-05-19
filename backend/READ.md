# School Health Management System

Hệ thống quản lý y tế học đường được phát triển với Spring Boot và MS SQL Server.

## Công nghệ sử dụng

### Core Dependencies

1. **Spring Web**
   - Dùng để phát triển RESTful APIs
   - Cung cấp các annotation như @RestController, @RequestMapping
   - Hỗ trợ xử lý HTTP requests và responses

2. **Spring Data JPA**
   - Framework để thao tác với database
   - Tự động tạo các implementation của Repository interfaces
   - Hỗ trợ các câu truy vấn tự động dựa trên tên method

3. **Spring Security**
   - Framework bảo mật cho ứng dụng
   - Xử lý authentication và authorization
   - Bảo vệ các endpoints với các quyền truy cập khác nhau

4. **MS SQL Server Driver**
   - Driver kết nối Java với MS SQL Server
   - Cung cấp JDBC API để thao tác với MS SQL

### Utility Dependencies

5. **Lombok**
   - Giảm code boilerplate bằng các annotations
   - @Data: Tự động tạo getters, setters, toString, equals, hashCode
   - @Builder: Tạo builder pattern
   - @Slf4j: Tạo logger
   - @RequiredArgsConstructor: Tạo constructor với final fields

6. **Validation**
   - Dùng để validate dữ liệu đầu vào
   - @NotNull: Giá trị không được null
   - @NotBlank: String không được trống
   - @Size: Độ dài của String hoặc Collection
   - @Email: Định dạng email
   - @Min/@Max: Giá trị số nhỏ nhất/lớn nhất

7. **Spring Boot DevTools**
   - Công cụ hỗ trợ phát triển
   - Automatic Restart: Tự động restart server khi code thay đổi
   - Live Reload: Tự động refresh browser khi frontend thay đổi
   - Property Defaults: Cấu hình mặc định cho development
   - Global Settings: Cấu hình global cho DevTools