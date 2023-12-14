package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Ficha;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class LivroRegistroResponse  {
	private Long id;
	private String requisicao;
	private String origem;
	private Ficha ficha;
	private String fichaInterna;
	private Date date;
	private MedicoResponse medico; 



	public LivroRegistroResponse(LivroRegistro obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
