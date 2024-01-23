package br.edu.ufape.hvu.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;



@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public  class Medico extends Usuario {
	private String crmv;
	@ManyToMany
	@JoinColumn(name = "medico_id")
	@ToString.Exclude
	private List<Especialidade> especialidade;

	@ManyToOne
	@JoinColumn(name = "instituicao_id")
	@ToString.Exclude
	private Instituicao instituicao;

}