package br.edu.ufape.hvu.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperBeanConfiguration {
	@Bean
	public ModelMapper modelMapper() {
	    return new ModelMapper();
	}
	
}