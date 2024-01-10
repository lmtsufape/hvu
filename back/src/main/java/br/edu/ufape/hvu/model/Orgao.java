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
public  class Orgao  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String image_path;
	private String nome;
	private Boolean sexoMacho;
	private Boolean sexoFemea;
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "foto_id")
	@ToString.Exclude
	private Foto foto; 
	@OneToMany
	@JoinColumn(name = "orgao_id")
	@ToString.Exclude
	private List<Area> area; 

}