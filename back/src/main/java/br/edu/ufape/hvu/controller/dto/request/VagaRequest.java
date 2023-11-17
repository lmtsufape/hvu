package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.time.LocalDateTime;
import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class VagaRequest  {
	private LocalDateTime dataHora;
	private EspecialidadeRequest especialidade; 
	private ConsultaRequest consulta; 


	public Vaga convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Vaga obj = modelMapper.map(this, Vaga.class);
		return obj;
	}



}
