package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Usuario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class UsuarioRequest  {
	private String email;
	private String cpf;
	private String senha;
	private String telefone;
	private String nome;
	private String userId;
	private EnderecoRequest endereco; 
	private long id;


	public Usuario convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Usuario obj = modelMapper.map(this, Usuario.class);
		return obj;
	}



}
