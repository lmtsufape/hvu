package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDate;
import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class HistoricoMedicoPregressoResponse  {
	private Long id;
	private String produto;
	private String observacoes;
	private LocalDate data;
	private List<MedicacaoPeriodicaResponse> medicacaoPeriodica; 



	public HistoricoMedicoPregressoResponse(HistoricoMedicoPregresso obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
