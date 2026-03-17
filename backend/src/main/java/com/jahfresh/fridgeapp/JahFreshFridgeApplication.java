package com.jahfresh.fridgeapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JahFreshFridgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(JahFreshFridgeApplication.class, args);
	}

}
