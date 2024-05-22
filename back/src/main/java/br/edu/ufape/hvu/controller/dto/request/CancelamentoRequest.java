package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cancelamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter @Setter @NoArgsConstructor 
public class CancelamentoRequest {
	private long id;
	private String descricao;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	private LocalDateTime dataCancelamento;
	private EspecialidadeRequest especialidade; 
	private AgendamentoRequest agendamento;
	private VagaRequest vaga;
	
	public Cancelamento convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Cancelamento obj = modelMapper.map(this, Cancelamento.class);
		return obj;
	}


}
