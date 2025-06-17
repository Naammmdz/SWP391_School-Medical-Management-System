package com.school.health.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HealthProfileFilterRequest {
    private Long id;
    private String name;
    private String className;
    private String gender;
    private String parentId;

}
