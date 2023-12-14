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
public  class MaterialColetado  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String codigo;
	private String nome;
	@OneToOne
	@ToString.Exclude
	private ExameMicroscopico exameMicroscopico; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "orgao_id")
	@ToString.Exclude
	private Orgao orgao; 

}