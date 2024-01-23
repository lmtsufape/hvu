package br.edu.ufape.hvu.controller.dto.request;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Etapa;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class EtapaRequest  {
	private String responsavel;
	private String observacoes;
	private Date dataHora;
	private Boolean concluido;
	private long id;


	public Etapa convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Etapa obj = modelMapper.map(this, Etapa.class);
		return obj;
	}



}
