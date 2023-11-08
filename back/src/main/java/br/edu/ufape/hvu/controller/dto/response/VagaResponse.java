package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;
import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class VagaResponse  {
	private Long id;
	private LocalDateTime dataHora;
	private EspecialidadeResponse especialidade; 
	private ConsultaResponse consulta; 



	public VagaResponse(Vaga obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
