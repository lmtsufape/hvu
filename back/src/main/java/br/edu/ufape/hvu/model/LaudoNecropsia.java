package br.edu.ufape.hvu.model;

import java.util.List;

import br.edu.ufape.hvu.model.enums.Microscopia;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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