package br.edu.ufape.hvu.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
	private boolean proximaConsulta;
	@ManyToOne
	@ToString.Exclude
	private Medico medico; 
	@ManyToOne
	@ToString.Exclude
	private Especialidade encaminhamento; 
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
	@ManyToOne
	@ToString.Exclude
	private Animal animal;


}