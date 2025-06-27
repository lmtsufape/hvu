package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Tutor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import jakarta.validation.constraints.AssertTrue;

@Getter @Setter @NoArgsConstructor
public class TutorRequest extends UsuarioRequest {
	private boolean anonimo;

	@AssertTrue(message = "Campos obrigatórios devem ser preenchidos para tutor não anônimo")
	public boolean isValid() {
		if (anonimo) {
			// Se for anônimo, libera qualquer campo vazio
			return true;
		}
		// Se não for anônimo, todos os campos obrigatórios devem estar preenchidos
		return getCpf() != null && !getCpf().isBlank()
				&& getTelefone() != null && !getTelefone().isBlank()
				&& getNome() != null && !getNome().isBlank()
				&& getEndereco() != null;
	}

	public Tutor convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		return modelMapper.map(this, Tutor.class);
	}
}
