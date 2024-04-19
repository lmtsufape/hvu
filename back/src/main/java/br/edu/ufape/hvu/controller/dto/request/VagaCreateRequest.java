package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class VagaCreateRequest {
	private LocalDate data;
	private List<VagaTipoRequest> turnoManha;
	private List<VagaTipoRequest> turnoTarde;

}
