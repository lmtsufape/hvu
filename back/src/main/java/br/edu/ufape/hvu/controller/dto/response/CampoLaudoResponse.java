package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.CampoLaudo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class CampoLaudoResponse  {
	private Long id;
	private String descricao;
	private OrgaoResponse orgao; 



	public CampoLaudoResponse(CampoLaudo obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
