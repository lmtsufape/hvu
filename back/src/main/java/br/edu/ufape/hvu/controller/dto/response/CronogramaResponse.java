package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cronograma;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class CronogramaResponse  {
	private long id;
	private String nome;
	private String rotina;
	private Double tempoAtendimento; 
	private MedicoResponse medico; 
	private List<EspecialidadeResponse> especialidade; 
	private List<VagaResponse> vaga; 



	public CronogramaResponse(Cronograma obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
