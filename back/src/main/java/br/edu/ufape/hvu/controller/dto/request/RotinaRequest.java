package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Processamento;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class RotinaRequest  {
	private Processamento processamento;
	private ExameMicroscopicoRequest exameMicroscopico; 
	private EtapaRequest etapa; 
	private long id;


	public Rotina convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Rotina obj = modelMapper.map(this, Rotina.class);
		return obj;
	}



}

