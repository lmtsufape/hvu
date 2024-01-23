package br.edu.ufape.hvu.controller.dto.response;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Etapa;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class EtapaResponse  {
	private Long id;
	private String responsavel;
	private String observacoes;
	private Date dataHora;
	private Boolean concluido;



	public EtapaResponse(Etapa obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
