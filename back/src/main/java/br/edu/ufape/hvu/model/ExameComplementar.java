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
public  class ExameComplementar  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private LocalDate dataExame;
	private String laudo;
	private Medico responsavel;
	private String arquivo;
	private String requisicao;
	@OneToOne
	@ToString.Exclude
	private TipoExame tipoExame; 

}