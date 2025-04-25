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
public  class UsuarioRequest  {
	@Email(message = "Forneça um endereço de email correto")
	private String email;
	@NotBlank(message = "Senha não pode estar em branco")
	private String senha;
	@NotBlank(message = "CPF não pode estar em branco")
	private String cpf;
	@NotBlank(message = "Telefone não pode estar em branco")
	private String telefone;
	@NotBlank(message = "Nome não pode estar em branco")
	private String nome;
	@NotNull
	private EnderecoRequest endereco; 
	private long id;

	public Usuario convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Usuario obj = modelMapper.map(this, Usuario.class);
		return obj;
	}
}
