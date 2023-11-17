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
public  class CronogramaRequest  {
	private String nome;
	private String rotina;
	private MedicoRequest medico; 
	private List<EspecialidadeRequest> especialidade; 
	private List<VagaRequest> vaga; 


	public Cronograma convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Cronograma obj = modelMapper.map(this, Cronograma.class);
		return obj;
	}



}
