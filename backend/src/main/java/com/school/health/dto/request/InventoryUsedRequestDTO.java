package com.school.health.dto.request;

import com.school.health.repository.InventoryRepo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class InventoryUsedRequestDTO {


    @Min(value = 1,message = "Quantity đã dùng phải lớn hơn 1")
    private Integer quantityUsed;
    private Integer relatedEvenId;
    private String notes;
}
