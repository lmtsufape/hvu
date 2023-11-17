package br.edu.ufape.hvu.model;

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
public  class Cronograma  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String nome;
	private String rotina;
	@OneToOne
	@ToString.Exclude
	private Medico medico; 
	@OneToMany
	@JoinColumn(name = "cronograma_id")
	@ToString.Exclude
	private List<Especialidade> especialidade; 
	@OneToMany
	@JoinColumn(name = "cronograma_id")
	@ToString.Exclude
	private List<Vaga> vaga; 

}