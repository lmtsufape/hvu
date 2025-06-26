package br.edu.ufape.hvu.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;



@SuppressWarnings("serial")
@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
@EqualsAndHashCode(callSuper=false)
@ToString
public  class Tutor extends Usuario {
	private String rg;
	@OneToMany
	@JoinColumn(name = "tutor_id")
	@ToString.Exclude
	private List<Animal> animal; 
	private boolean anonimo;
}