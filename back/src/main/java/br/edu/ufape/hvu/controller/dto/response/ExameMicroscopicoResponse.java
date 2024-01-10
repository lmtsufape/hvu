package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Opcoes;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class ExameMicroscopicoResponse  {
	private Long id;
	private Opcoes opcoes;
	private String observacoes;
	private Date dataHora;
	private String foto_path;
	private OrgaoResponse orgao; 
	private EtapaResponse etapa; 
	private LaudoMicroscopiaResponse laudoMicroscopia; 



	public ExameMicroscopicoResponse(ExameMicroscopico obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
