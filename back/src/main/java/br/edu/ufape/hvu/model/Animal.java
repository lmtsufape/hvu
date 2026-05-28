package br.edu.ufape.hvu.model;

import java.time.LocalDate;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Animal  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String nome;
	private String sexo;
	private String alergias;
	private LocalDate dataNascimento;
	private String imagem;
	private boolean castrado;
	private double peso;
	private String numeroFicha;
	@ManyToOne
	@ToString.Exclude
	private Raca raca;

	@Enumerated(EnumType.STRING)
	private OrigemAnimal origemAnimal;

	private boolean obito;
}