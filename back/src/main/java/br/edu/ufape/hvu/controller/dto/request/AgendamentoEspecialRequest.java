package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class AgendamentoEspecialRequest {

	private EspecialidadeRequest especialidade;
	private AnimalRequest animal;
	private TipoConsultaRequest tipoConsulta;
	private MedicoRequest medico;
	private LocalDateTime horario;
	private boolean tipoEspecial;
}
