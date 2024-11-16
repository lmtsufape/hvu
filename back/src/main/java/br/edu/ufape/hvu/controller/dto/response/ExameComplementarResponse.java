package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.ExameComplementar;
import br.edu.ufape.hvu.model.Medico;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class ExameComplementarResponse  {
	private Long id;
	private LocalDate dataExame;
	private String laudo;
	private Medico responsavel;
	private String arquivo;
	private String requisicao;



	public ExameComplementarResponse(ExameComplementar obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
