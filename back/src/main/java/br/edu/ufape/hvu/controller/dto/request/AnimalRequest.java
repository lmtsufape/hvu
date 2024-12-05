package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Animal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class AnimalRequest  {
	private String nome;
	private String sexo;
	private String alergias;
	private LocalDate dataNascimento;
	private String imagem;
	private boolean castrado;
	private double peso;
	private RacaRequest raca;
	private long id;
	private String numeroFicha;


	public Animal convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Animal obj = modelMapper.map(this, Animal.class);
		return obj;
	}



}
