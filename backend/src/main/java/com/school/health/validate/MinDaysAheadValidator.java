package com.school.health.validate;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class MinDaysAheadValidator implements ConstraintValidator<MinDaysAhead, LocalDate> {

    private int minDays;

    @Override
    public void initialize(MinDaysAhead constraintAnnotation) {
        this.minDays = constraintAnnotation.days();
    }

    @Override
    public boolean isValid(LocalDate date, ConstraintValidatorContext context) {
        if (date == null) return true; // Nếu muốn bắt buộc, đổi thành false

        LocalDate today = LocalDate.now();
        return date.isAfter(today.plusDays(minDays - 1)); // VD: 20 → phải sau hôm nay + 19
    }
}
