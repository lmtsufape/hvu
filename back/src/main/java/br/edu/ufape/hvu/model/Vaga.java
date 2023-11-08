package br.edu.ufape.hvu.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
public  class Vaga  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private LocalDateTime dataHora;
	@OneToOne
	@ToString.Exclude
	private Especialidade especialidade; 
	@OneToOne
	@ToString.Exclude
	private Consulta consulta; 

}