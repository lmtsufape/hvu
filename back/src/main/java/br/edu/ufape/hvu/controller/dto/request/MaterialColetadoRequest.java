package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.MaterialColetado;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class MaterialColetadoRequest  {
	private String codigo;
	private String nome;
	private OrgaoRequest orgao; 
	private long id;


	public MaterialColetado convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		MaterialColetado obj = modelMapper.map(this, MaterialColetado.class);
		return obj;
	}



}
