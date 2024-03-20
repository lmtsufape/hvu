package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Vaga;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


@Getter @Setter @NoArgsConstructor 
public  class VagaRequest  {
	private long id;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataHora;
	private String status;
	private EspecialidadeRequest especialidade; 
	private ConsultaRequest consulta; 
	private TipoConsultaRequest tipoConsulta;
	private AgendamentoRequest agendamento;
	private MedicoRequest medico;


	public Vaga convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Vaga obj = modelMapper.map(this, Vaga.class);
		return obj;
	}



}
