package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class AvaliacaoFisicoGeralRequest  {
	private String temperatura;
	private String frequenciaCardiaca;
	private String frequenciaRespiratoria;
	private String tpc;
	private TipoMucosaRequest tipoMucosa; 
	private NivelConscienciaRequest nivelConsciencia; 
	private TipoTurgorCutaneoRequest tipoTurgorCutaneo; 
	private NivelHidratacaoRequest nivelHidratacao; 
	private TipoLinfonodosRequest tipoLinfonodos; 
	private ScoreCorporalRequest scoreCorporal; 
	private TipoPosturaRequest tipoPostura; 


	public AvaliacaoFisicoGeral convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		AvaliacaoFisicoGeral obj = modelMapper.map(this, AvaliacaoFisicoGeral.class);
		return obj;
	}



}
