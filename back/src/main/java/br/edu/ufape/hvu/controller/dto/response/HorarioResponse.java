package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class HorarioResponse {
	private LocalTime inicio;
	private LocalTime fim;

}
