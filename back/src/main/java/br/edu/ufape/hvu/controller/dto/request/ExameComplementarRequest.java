package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.time.LocalDate;
import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class ExameComplementarRequest  {
	private LocalDate dataExame;
	private String laudo;
	private Medico responsavel;
	private String arquivo;
	private String requisicao;
	private TipoExameRequest tipoExame;
	private long id;


	public ExameComplementar convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		ExameComplementar obj = modelMapper.map(this, ExameComplementar.class);
		return obj;
	}



}
