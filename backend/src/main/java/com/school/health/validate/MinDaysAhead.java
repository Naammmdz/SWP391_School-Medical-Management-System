
package com.school.health.validate;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = MinDaysAheadValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MinDaysAhead {

    String message() default "Ngày phải cách hôm nay ít nhất số ngày được yêu cầu";

    int days();

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
