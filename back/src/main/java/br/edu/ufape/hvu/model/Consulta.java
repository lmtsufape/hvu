package br.edu.ufape.hvu.model;

import java.time.LocalDateTime;
import java.util.List;

import br.edu.ufape.hvu.model.enums.TipoFicha;
import jakarta.persistence.*;
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
public  class Consulta  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private Double pesoAtual;
	private Double idadeAtual;
	private boolean proximaConsulta;
	@ManyToOne
	@ToString.Exclude
	private Especialidade encaminhamento;
	@ManyToOne
	@ToString.Exclude
	private Medico medico;
	@ManyToMany
	@JoinColumn(name = "consulta_id")
	@ToString.Exclude
	private List<Estagiario> estagiario;
	@ManyToOne
	@ToString.Exclude
	private Animal animal;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	@OneToOne
	private Ficha ficha;
	@Column(nullable = false)
	private boolean tipo;
}