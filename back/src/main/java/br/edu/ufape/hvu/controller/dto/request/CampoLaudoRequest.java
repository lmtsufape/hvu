package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.CampoLaudo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class CampoLaudoRequest  {
	private String descricao;
	private OrgaoRequest orgao;
	private long id;


	public CampoLaudo convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		CampoLaudo obj = modelMapper.map(this, CampoLaudo.class);
		return obj;
	}



}
