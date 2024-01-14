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
public  class MaterialColetadoRequest  {
	private String codigo;
	private String nome;
	private ExameMicroscopicoRequest exameMicroscopico; 
	private OrgaoRequest orgao; 
	private long id;


	public MaterialColetado convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		MaterialColetado obj = modelMapper.map(this, MaterialColetado.class);
		return obj;
	}



}
