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
public  class LaudoMicroscopia  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String conclusao;
	@OneToOne
	@ToString.Exclude
	private FichaSolicitacaoServico fichaSolicitacaoServico; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "campoLaudo_id")
	@ToString.Exclude
	private CampoLaudo campoLaudo; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "etapa_id")
	@ToString.Exclude
	private Etapa etapa; 
	@ManyToMany
	@ToString.Exclude
	private List<Estagiario> estagiario; 

}