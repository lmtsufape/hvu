package br.edu.ufape.hvu.controller.dto.request;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Horario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class CronogramaRequest  {
	private long id;
	private String nome;
	private String horariosJson;
	private Map<DayOfWeek, Horario> horarios;
	private Double tempoAtendimento; 
	private MedicoRequest medico; 
	private EspecialidadeRequest especialidade; 
	private List<VagaRequest> vaga; 


	public Cronograma convertToEntity() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		try {
			this.horarios = objectMapper.readValue(horariosJson, new TypeReference<Map<DayOfWeek, Horario>>() {});
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
	    Cronograma cronograma = modelMapper.map(this, Cronograma.class);
	    return cronograma;
	}



}
