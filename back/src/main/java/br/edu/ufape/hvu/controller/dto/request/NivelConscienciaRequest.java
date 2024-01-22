package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.NivelConsciencia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class NivelConscienciaRequest  {
	private String nome;
	private long id;


	public NivelConsciencia convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		NivelConsciencia obj = modelMapper.map(this, NivelConsciencia.class);
		return obj;
	}



}
