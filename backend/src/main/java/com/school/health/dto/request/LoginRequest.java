package com.school.health.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

public class LoginRequest {

    @Getter
    @Setter
    @NotBlank(message = "Login identifier cannot be blank")
    private String emailOrPhone;

    @Getter
    @Setter
    @NotBlank(message = "Password cannot be blank")
    private String password;

}
