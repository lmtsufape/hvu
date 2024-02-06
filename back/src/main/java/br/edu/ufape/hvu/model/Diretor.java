package br.edu.ufape.hvu.model;

import jakarta.persistence.Entity;
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
public  class Diretor extends Usuario {
	private String matricula;

}