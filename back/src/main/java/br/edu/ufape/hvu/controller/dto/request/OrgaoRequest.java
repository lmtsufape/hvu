package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Orgao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class OrgaoRequest  {
	private String image_path;
	private String nome;
	private Boolean sexoMacho;
	private Boolean sexoFemea;
	private FotoRequest foto; 
	private List<AreaRequest> area;
	private long id;


	public Orgao convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Orgao obj = modelMapper.map(this, Orgao.class);
		return obj;
	}



}
