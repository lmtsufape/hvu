package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Tutor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class TutorResponse extends UsuarioResponse {
	private String rg;
	private List<AnimalResponse> animais;
	private boolean anonimo;

	public TutorResponse(Tutor obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);
	}
}
