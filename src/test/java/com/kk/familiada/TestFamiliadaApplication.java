package com.kk.familiada;

import org.springframework.boot.SpringApplication;

public class TestFamiliadaApplication {

	public static void main(String[] args) {
		SpringApplication.from(FamiliadaApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
