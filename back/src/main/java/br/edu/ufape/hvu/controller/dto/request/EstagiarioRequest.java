package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Estagiario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class EstagiarioRequest  {
	private String nome;
	private String cpf;
	private String periodo;
	private boolean obrigatorio;
	private boolean ativo;
	private long id;


	public Estagiario convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Estagiario obj = modelMapper.map(this, Estagiario.class);
		return obj;
	}



}
