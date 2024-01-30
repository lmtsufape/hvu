package br.edu.ufape.hvu.model;

import java.util.Date;

import br.edu.ufape.hvu.model.enums.Opcoes;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
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
public  class ExameMicroscopico  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private Opcoes opcoes;
	private String observacoes;
	private Date dataHora;
	private String foto_path;
	@OneToOne
	@ToString.Exclude
	private Orgao orgao; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "etapa_id")
	@ToString.Exclude
	private Etapa etapa; 
    	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "laudoMicroscopia_id")
	@ToString.Exclude
	private LaudoMicroscopia laudoMicroscopia;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "foto_id")
	@ToString.Exclude
	private Foto foto;

}
