package br.edu.ufape.hvu.controller.dto.request;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LivroRegistro;
import br.edu.ufape.hvu.model.enums.Ficha;
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
	private long id;


	public LivroRegistro convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LivroRegistro obj = modelMapper.map(this, LivroRegistro.class);
		return obj;
	}



}
