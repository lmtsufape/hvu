package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Parecer;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class ParecerRequest  {
	private String observacoes;
	private String diagnostico;
	private TipoPrognosticoRequest tipoPrognostico;
	private long id;


	public Parecer convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Parecer obj = modelMapper.map(this, Parecer.class);
		return obj;
	}



}
