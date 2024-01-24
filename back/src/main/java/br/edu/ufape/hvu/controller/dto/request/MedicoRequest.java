package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Medico;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class MedicoRequest extends UsuarioRequest {
	private long id;
	private String crmv;
	private List<EspecialidadeRequest> especialidade;
	private InstituicaoRequest instituicao;


	public Medico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Medico obj = modelMapper.map(this, Medico.class);
		return obj;
	}



}
