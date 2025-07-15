//package com.school.health.config;
//
//import com.school.health.entity.User;
//import com.school.health.enums.UserRole;
//import com.school.health.repository.UserRepository;
//import com.school.health.service.UserService;
//import com.school.health.service.impl.UserServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDate;
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    @Autowired
//    UserService userService;
//
//    @Override
//    public void run(String... args) throws Exception {
//
//
//      userService.registerUser("admin ne", "admin@gmail.com", "0373777412", "123456", UserRole.ADMIN);
//
//    }
//}
