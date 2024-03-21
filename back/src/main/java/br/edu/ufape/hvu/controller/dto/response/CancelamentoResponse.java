package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cancelamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter @Setter @NoArgsConstructor
public class CancelamentoResponse {
	private long id;
	private String descricao;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataCancelamento;
	private EspecialidadeResponse especialidade; 
	private AgendamentoResponse agendamento;
	
	public CancelamentoResponse(Cancelamento obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
