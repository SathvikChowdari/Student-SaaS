package com.schoolms.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class BackendApplication {
	Dotenv dotenv = Dotenv.load();

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
