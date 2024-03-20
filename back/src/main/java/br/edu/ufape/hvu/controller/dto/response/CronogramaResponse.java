package br.edu.ufape.hvu.controller.dto.response;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Horario;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class CronogramaResponse  {
	private long id;
	private String nome;
	private String horariosJson;
	private Map<DayOfWeek, Horario> horarios;
	private Double tempoAtendimento; 
	private MedicoResponse medico; 
	private EspecialidadeResponse especialidade; 
	private List<VagaResponse> vaga; 


	public CronogramaResponse(Cronograma obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
