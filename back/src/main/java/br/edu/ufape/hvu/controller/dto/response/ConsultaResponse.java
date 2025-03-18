package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Consulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter @Setter @NoArgsConstructor
public class ConsultaResponse {
	private Long id;
	private Double pesoAtual;
	private Double idadeAtual;
	private MedicoResponse medico;
	private boolean proximaConsulta;
	private AnimalResponse animal;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	private EspecialidadeResponse encaminhamento;
	private FichaResponse ficha;
	private List<EstagiarioResponse> estagiario;

	public ConsultaResponse(Consulta obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);
	}
}