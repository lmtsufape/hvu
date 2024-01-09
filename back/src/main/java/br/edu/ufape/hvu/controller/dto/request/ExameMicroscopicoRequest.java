package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Opcoes;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class ExameMicroscopicoRequest  {
	private Opcoes opcoes;
	private String observacoes;
	private Date dataHora;
	private String foto_path;
	private OrgaoRequest orgao; 
	private EtapaRequest etapa; 
	private LaudoMicroscopiaRequest laudoMicroscopia; 


	public ExameMicroscopico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		ExameMicroscopico obj = modelMapper.map(this, ExameMicroscopico.class);
		return obj;
	}



}
