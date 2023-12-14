package br.edu.ufape.hvu.model;

import java.util.*;

import br.edu.ufape.hvu.model.enums.Ficha;

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
public  class LivroRegistro  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String requisicao;
	private String origem;
	private Ficha ficha;
	private String fichaInterna;
	private Date date;
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "medico_id")
	@ToString.Exclude
	private Medico medico; 

}