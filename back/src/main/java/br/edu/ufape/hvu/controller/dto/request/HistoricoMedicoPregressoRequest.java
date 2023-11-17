package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.time.LocalDate;
import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class HistoricoMedicoPregressoRequest  {
	private String produto;
	private String observacoes;
	private LocalDate data;
	private List<MedicacaoPeriodicaRequest> medicacaoPeriodica; 


	public HistoricoMedicoPregresso convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		HistoricoMedicoPregresso obj = modelMapper.map(this, HistoricoMedicoPregresso.class);
		return obj;
	}



}
