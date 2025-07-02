package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDate;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Animal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class AnimalResponse  {
	private long id;
	private String nome;
	private String sexo;
	private String alergias;
	private LocalDate dataNascimento;
	private String imagem;
	private boolean castrado;
	private double peso;
	private String numeroFicha;
	private RacaResponse raca;
	private boolean lapa;



	public AnimalResponse(Animal obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
