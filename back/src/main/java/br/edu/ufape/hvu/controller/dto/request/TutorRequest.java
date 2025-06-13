package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Tutor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class TutorRequest extends UsuarioRequest {
	private String rg;
	private List<AnimalRequest> animal;
	private long id;


	public Tutor convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Tutor.class);
	}
}
