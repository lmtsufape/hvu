package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class AvaliacaoFisicoGeralResponse  {
	private Long id;
	private String temperatura;
	private String frequenciaCardiaca;
	private String frequenciaRespiratoria;
	private String tpc;
	private TipoMucosaResponse tipoMucosa; 
	private NivelConscienciaResponse nivelConsciencia; 
	private TipoTurgorCutaneoResponse tipoTurgorCutaneo; 
	private NivelHidratacaoResponse nivelHidratacao; 
	private TipoLinfonodosResponse tipoLinfonodos; 
	private ScoreCorporalResponse scoreCorporal; 
	private TipoPosturaResponse tipoPostura; 



	public AvaliacaoFisicoGeralResponse(AvaliacaoFisicoGeral obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
