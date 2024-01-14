package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class ScoreCorporalRequest  {
	private String nivel;
	private long id;


	public ScoreCorporal convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		ScoreCorporal obj = modelMapper.map(this, ScoreCorporal.class);
		return obj;
	}



}
