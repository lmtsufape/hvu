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
public  class Consulta  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private Double pesoAtual;
	private Double idadeAtual;
	private String queixaPrincipal;
	private boolean tipo;
	private String alteracoesClinicasDiversas;
	private String suspeitasClinicas;
	private String alimentacao;
	@ManyToOne
	@ToString.Exclude
	private Medico medico; 
	@OneToOne
	@ToString.Exclude
	private AvaliacaoFisicoEspecial avaliacaoFisicoEspecial; 
	@OneToOne
	@ToString.Exclude
	private Parecer parecer; 
	@OneToOne
	@ToString.Exclude
	private AvaliacaoFisicoGeral avaliacaoFisicoGeral; 
	@OneToMany
	@JoinColumn(name = "consulta_id")
	@ToString.Exclude
	private List<Prescricao> prescricao; 
	@ManyToMany
	@JoinColumn(name = "consulta_id")
	@ToString.Exclude
	private List<Estagiario> estagiario; 
	@OneToMany
	@JoinColumn(name = "consulta_id")
	@ToString.Exclude
	private List<ExameComplementar> exameComplementar; 

}