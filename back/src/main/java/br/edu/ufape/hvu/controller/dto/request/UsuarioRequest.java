package br.edu.ufape.hvu.controller.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Usuario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor
public class UsuarioRequest {
	@Email(message = "Forneça um endereço de email correto")
	private String email;
	private String senha;
	private String cpf;        // sem @NotBlank
	private String telefone;   // sem @NotBlank
	private String nome;       // sem @NotBlank
	private EnderecoRequest endereco;  // sem @NotNull
	private long id;

	public Usuario convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Usuario obj = modelMapper.map(this, Usuario.class);
		return obj;
	}
}

