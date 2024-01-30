package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Rotina;
import br.edu.ufape.hvu.model.enums.Processamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class RotinaResponse  {
	private Long id;
	private Processamento processamento;
	private ExameMicroscopicoResponse exameMicroscopico; 
	private EtapaResponse etapa;
	private String observacao;



	public RotinaResponse(Rotina obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
