package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.TipoConsulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class TipoConsultaRequest  {
	private long id;
	private String tipo;
	private List<CronogramaRequest> cronograma; 


	public TipoConsulta convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		TipoConsulta obj = modelMapper.map(this, TipoConsulta.class);
		return obj;
	}



}
