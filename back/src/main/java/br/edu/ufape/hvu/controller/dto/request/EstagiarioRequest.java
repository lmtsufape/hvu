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
public  class EstagiarioRequest  {
	private String nome;
	private String cpf;
	private String periodo;
	private boolean obrigatorio;
	private boolean ativo;
	private long id;


	public Estagiario convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Estagiario obj = modelMapper.map(this, Estagiario.class);
		return obj;
	}



}
