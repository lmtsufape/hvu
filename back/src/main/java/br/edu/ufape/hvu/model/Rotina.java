package br.edu.ufape.hvu.model;

import java.util.*;

import br.edu.ufape.hvu.model.enums.Processamento;

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
public  class Rotina  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private Processamento processamento;
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "exameMicroscopico_id")
	@ToString.Exclude
	private ExameMicroscopico exameMicroscopico; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "etapa_id")
	@ToString.Exclude
	private Etapa etapa; 

}