package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Medico;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class MedicoResponse extends UsuarioResponse {
	private String crmv;
	private List<EspecialidadeResponse> especialidade;
	private Instituicao instituicao;



	public MedicoResponse(Medico obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
