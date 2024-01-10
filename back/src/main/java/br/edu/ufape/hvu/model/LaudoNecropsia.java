package br.edu.ufape.hvu.model;

import java.util.*;

import br.edu.ufape.hvu.model.enums.Microscopia;

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
public  class LaudoNecropsia  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String fichaClinica;
	private String ficha;
	private Microscopia tipoMicroscopia;
	private String conclusao;
	@OneToOne
	@ToString.Exclude
	private FichaSolicitacaoServico fichaSolicitacaoServico; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "campoLaudo_id")
	@ToString.Exclude
	private CampoLaudo campoLaudo; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "laudoMicroscopia_id")
	@ToString.Exclude
	private LaudoMicroscopia laudoMicroscopia; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "foto_id")
	@ToString.Exclude
	private Foto foto; 
	@ManyToMany
	@ToString.Exclude
	private List<Estagiario> estagiario; 

}