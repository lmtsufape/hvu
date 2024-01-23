package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.MedicacaoPeriodica;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class MedicacaoPeriodicaRequest  {
	private String nome;
	private String tipo;
	private long id;


	public MedicacaoPeriodica convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		MedicacaoPeriodica obj = modelMapper.map(this, MedicacaoPeriodica.class);
		return obj;
	}



}
