package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.Microscopia;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class LaudoNecropsiaRequest  {
	private String fichaClinica;
	private String ficha;
	private Microscopia tipoMicroscopia;
	private String conclusao;
	private FichaSolicitacaoServicoRequest fichaSolicitacaoServico; 
	private CampoLaudoRequest campoLaudo; 
	private LaudoMicroscopiaRequest laudoMicroscopia; 
	private FotoRequest foto; 
	private List<EstagiarioRequest> estagiario; 


	public LaudoNecropsia convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LaudoNecropsia obj = modelMapper.map(this, LaudoNecropsia.class);
		return obj;
	}



}
