package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Instituicao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class InstituicaoRequest  {
	private String nome;
	private EnderecoRequest endereco;
	private long id;


	public Instituicao convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Instituicao obj = modelMapper.map(this, Instituicao.class);
		return obj;
	}



}
