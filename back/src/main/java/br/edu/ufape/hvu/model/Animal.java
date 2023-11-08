package br.edu.ufape.hvu.model;

import java.time.LocalDate;
import java.util.*;
import java.math.*;
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
public  class Animal  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String nome;
	private String sexo;
	private String alergias;
	private LocalDate dataNascimento;
	private String imagem;
	@OneToOne
	@ToString.Exclude
	private Raca raca; 
	@OneToOne
	@ToString.Exclude
	private HistoricoMedicoPregresso historicoMedicoPregresso; 

}