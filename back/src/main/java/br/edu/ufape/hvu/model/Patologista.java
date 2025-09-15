package br.edu.ufape.hvu.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@SuppressWarnings("serial")
@Entity
@Getter @Setter /*@NoArgsConstructor*/ @AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString
public class Patologista extends Medico {

}
