package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.controller.dto.response.OrgaoResponse;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Foto;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class FotoRequest  {
	private long id;
	private String titulo;
	private String foto_path;


	public Foto convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Foto obj = modelMapper.map(this, Foto.class);
		return obj;
	}



}
