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
public  class TipoConsultaRequest  {
	private String tipo;
	private List<AgendamentoRequest> agendamento; 
	private List<VagaRequest> vaga;
	private long id;


	public TipoConsulta convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		TipoConsulta obj = modelMapper.map(this, TipoConsulta.class);
		return obj;
	}



}
