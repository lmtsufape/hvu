package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Cancelamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter @Setter @NoArgsConstructor 
public class CancelamentoRequest {
	@NotBlank(message = "Forneça uma descrição")
	private String descricao;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	@NotNull
	private LocalDateTime dataCancelamento;
	@NotNull
	private EspecialidadeRequest especialidade;
	@NotNull
	private AgendamentoRequest agendamento;
	@NotNull
	private VagaRequest vaga;
	
	public Cancelamento convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Cancelamento.class);
	}
}
