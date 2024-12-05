package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Prescricao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class PrescricaoRequest  {
	private Double dose;
	private String frequencia;
	private String periodo;
	private String observacoes;
	private long id;


	public Prescricao convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Prescricao obj = modelMapper.map(this, Prescricao.class);
		return obj;
	}



}
