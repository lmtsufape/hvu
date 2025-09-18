package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.CampoLaudo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class CampoLaudoRequest {
    private long id;
	private String descricao;
	private OrgaoRequest orgao;

	public CampoLaudo convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, CampoLaudo.class);
	}
}
