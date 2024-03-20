package br.edu.ufape.hvu.model;

import java.io.IOException;
import java.time.DayOfWeek;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
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
public  class Cronograma  {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;
	private String nome;
	@Lob
    private String horariosJson;
    @Transient
    private Map<DayOfWeek, Horario> horarios;
	private Double tempoAtendimento; 
	@ManyToOne
	@ToString.Exclude
	private Medico medico; 
	@ManyToOne
	@JoinColumn(name = "cronograma_id")
	@ToString.Exclude
	private Especialidade especialidade; 
	@OneToMany
	@JoinColumn(name = "cronograma_id")
	@ToString.Exclude
	private List<Vaga> vaga; 
	
	public Map<DayOfWeek, Horario> getHorarios() {
	    if (this.horarios == null) {
	        desconverterHorarios();
	    }
	    return this.horarios;
	}
	
	private void desconverterHorarios() {
	    if (this.horariosJson != null && !this.horariosJson.isEmpty()) {
	        ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());

	        try {
				this.horarios = objectMapper.readValue(horariosJson, new TypeReference<Map<DayOfWeek, Horario>>() {});
	        } catch (IOException e) {
	            throw new RuntimeException("Falha ao converter os horários", e);
	        }
	    } else {
	        this.horarios = new HashMap<>();
	    }
	}



}