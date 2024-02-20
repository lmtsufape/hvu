package br.edu.ufape.hvu.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
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
	@ManyToOne
	@ToString.Exclude
	private TipoMucosa tipoMucosa; 
	@ManyToOne
	@ToString.Exclude
	private NivelConsciencia nivelConsciencia; 
	@ManyToOne
	@ToString.Exclude
	private TipoTurgorCutaneo tipoTurgorCutaneo; 
	@ManyToOne
	@ToString.Exclude
	private NivelHidratacao nivelHidratacao; 
	@ManyToOne
	@ToString.Exclude
	private TipoLinfonodos tipoLinfonodos; 
	@ManyToOne
	@ToString.Exclude
	private ScoreCorporal scoreCorporal; 
	@ManyToOne
	@ToString.Exclude
	private TipoPostura tipoPostura; 

}