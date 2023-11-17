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
public  class AvaliacaoFisicoEspecial  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String sistemaRespiratorio;
	private String sistemaDigestorio;
	private String sistemaCardioVascular;
	private String sistemaNefrourinario;
	private String pele;
	private String ouvidos;
	private String sistemaNeurologico;
	private String sistemaLocomotor;
	private String sistemaReprodutor;
	private String olhos;

}