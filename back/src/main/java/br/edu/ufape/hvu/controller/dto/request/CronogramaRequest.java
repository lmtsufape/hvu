package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cronograma;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class CronogramaRequest  {
	private String nome;
	private String rotina;
	private List<EspecialidadeRequest> especialidade; 
	private List<VagaRequest> vaga; 
	private long id;


	public Cronograma convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Cronograma obj = modelMapper.map(this, Cronograma.class);
		return obj;
	}



}
