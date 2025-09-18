package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDate;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Animal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class AnimalRequest {
    private long id;
	@NotBlank(message = "Nome não pode estar em branco")
	private String nome;
	@NotBlank(message = "Sexo não pode estar em branco")
	private String sexo;
	private String alergias;
	private LocalDate dataNascimento;
	//@NotBlank(message = "Imagens não pode estar em branco")
	private String imagem;
	private boolean castrado;
	@NotNull
	private double peso;
	@NotNull
	private RacaRequest raca;
	//@NotBlank(message = "Numero ficha não pode estar em branco")
	private String numeroFicha;
	private OrigemAnimal origemAnimal;
	private boolean obito;

	public Animal convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Animal.class);
	}
}
