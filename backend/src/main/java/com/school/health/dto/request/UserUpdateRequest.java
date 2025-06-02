package com.school.health.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {

    @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
    private String fullName;

    @Size(max = 100, message = "Email tối đa 100 ký tự")
    private String email;

    @Size(max = 10, message = "Số điện thoại tối đa 10 ký tự")
    private String phone;

}
