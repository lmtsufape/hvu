package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Ficha;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class LivroRegistroRequest  {
	private String requisicao;
	private String origem;
	private Ficha ficha;
	private String fichaInterna;
	private Date date;
	private MedicoRequest medico; 


	public LivroRegistro convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LivroRegistro obj = modelMapper.map(this, LivroRegistro.class);
		return obj;
	}



}
