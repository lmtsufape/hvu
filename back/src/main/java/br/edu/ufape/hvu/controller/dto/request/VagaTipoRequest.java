package br.edu.ufape.hvu.controller.dto.request;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class VagaTipoRequest {

	private EspecialidadeRequest especialidade;
	private TipoConsultaRequest tipoConsulta;

}
