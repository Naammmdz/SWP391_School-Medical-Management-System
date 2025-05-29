package com.school.health.dto.respone;

import com.school.health.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class LoginSuccessResponse {

    private String token;
    private String type = "Bearer";
    private Integer userId;
    private String email;
    private String phone;
    private String fullName;
    private UserRole userRole;
}
