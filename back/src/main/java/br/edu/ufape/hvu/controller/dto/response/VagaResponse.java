package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Vaga;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class VagaResponse  {
	private Long id;
	private LocalDateTime dataHora;
	private String status;
	private EspecialidadeResponse especialidade; 
	private ConsultaResponse consulta; 
	private TipoConsultaResponse tipoConsulta; 
	private AgendamentoResponse agendamento;


	public VagaResponse(Vaga obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
