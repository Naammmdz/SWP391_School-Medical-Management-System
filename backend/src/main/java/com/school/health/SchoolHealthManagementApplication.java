package com.school.health;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SchoolHealthManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(SchoolHealthManagementApplication.class, args);
	}


}
