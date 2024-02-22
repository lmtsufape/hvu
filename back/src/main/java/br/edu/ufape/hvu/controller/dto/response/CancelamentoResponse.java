package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cancelamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CancelamentoResponse {
	private long id;
	private String descricao;
	private LocalDateTime dataVaga;
	private LocalDateTime dataCancelamento;
	private EspecialidadeResponse especialidade; 
	
	public CancelamentoResponse(Cancelamento obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
