package com.school.health.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserResponse {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private String Role;
    private Boolean isActive;
}
