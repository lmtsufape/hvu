package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.TipoTurgorCutaneo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class TipoTurgorCutaneoRequest  {
	private String nome;
	private long id;


	public TipoTurgorCutaneo convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		TipoTurgorCutaneo obj = modelMapper.map(this, TipoTurgorCutaneo.class);
		return obj;
	}



}
