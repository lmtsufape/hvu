package br.edu.ufape.hvu.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.format.annotation.DateTimeFormat;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Cancelamento {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String descricao;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataCancelamento;
	@ManyToOne
	@ToString.Exclude
	private Especialidade especialidade; 

}
