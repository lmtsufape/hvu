package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class MaterialColetadoResponse  {
	private Long id;
	private String codigo;
	private String nome;
	private ExameMicroscopicoResponse exameMicroscopico; 
	private OrgaoResponse orgao; 



	public MaterialColetadoResponse(MaterialColetado obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
