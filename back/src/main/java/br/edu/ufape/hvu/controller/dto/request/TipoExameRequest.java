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
public  class TipoExameRequest  {
	private String nome;
	private String observacoes;
	private long id;


	public TipoExame convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		TipoExame obj = modelMapper.map(this, TipoExame.class);
		return obj;
	}



}
