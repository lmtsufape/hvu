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
public  class AvaliacaoFisicoGeral  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String temperatura;
	private String frequenciaCardiaca;
	private String frequenciaRespiratoria;
	private String tpc;
	@OneToOne
	@ToString.Exclude
	private TipoMucosa tipoMucosa; 
	@OneToOne
	@ToString.Exclude
	private NivelConsciencia nivelConsciencia; 
	@OneToOne
	@ToString.Exclude
	private TipoTurgorCutaneo tipoTurgorCutaneo; 
	@OneToOne
	@ToString.Exclude
	private NivelHidratacao nivelHidratacao; 
	@OneToOne
	@ToString.Exclude
	private TipoLinfonodos tipoLinfonodos; 
	@OneToOne
	@ToString.Exclude
	private ScoreCorporal scoreCorporal; 
	@OneToOne
	@ToString.Exclude
	private TipoPostura tipoPostura; 

}