package com.school.health.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.*;

@RestControllerAdvice
public class ValidationExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<Map<String, String>>>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = new ArrayList<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            Map<String, String> errorDetails = new HashMap<>();
            errorDetails.put("field", error.getField());
            errorDetails.put("message", error.getDefaultMessage());
            errors.add(errorDetails);
        }

        Map<String, List<Map<String, String>>> responseBody = new HashMap<>();
        responseBody.put("errors", errors);

        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, List<Map<String, String>>>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("field", ex.getField());
        error.put("message", ex.getMessage());
        List<Map<String, String>> errors = List.of(error);

        Map<String, List<Map<String, String>>> responseBody = new HashMap<>();
        responseBody.put("errors", errors);

        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

}
