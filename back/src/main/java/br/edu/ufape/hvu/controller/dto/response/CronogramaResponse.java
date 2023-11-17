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
public  class CronogramaResponse  {
	private Long id;
	private String nome;
	private String rotina;
	private MedicoResponse medico; 
	private List<EspecialidadeResponse> especialidade; 
	private List<VagaResponse> vaga; 



	public CronogramaResponse(Cronograma obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
