package br.edu.ufape.hvu.controller.dto.request;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter @Setter @NoArgsConstructor
public class VagaTipoRequest {

	private EspecialidadeRequest especialidade;
	private TipoConsultaRequest tipoConsulta;
	private MedicoRequest medico;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	private LocalTime horario;
}
