package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Medico;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class MedicoRequest extends UsuarioRequest {
	private long id;
	@NotNull( message = "Crmv não pode estar em branco")
	private String crmv;
	@NotNull
	private List<EspecialidadeRequest> especialidade;
	@NotNull
	private InstituicaoRequest instituicao;


	public Medico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Medico.class);
	}
}
