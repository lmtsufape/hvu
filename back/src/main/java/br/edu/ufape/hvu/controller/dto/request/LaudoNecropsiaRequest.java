package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LaudoNecropsia;
import br.edu.ufape.hvu.model.enums.Microscopia;
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
	private FotoRequest foto; 
	private List<EstagiarioRequest> estagiario;
	private long id;


	public LaudoNecropsia convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LaudoNecropsia obj = modelMapper.map(this, LaudoNecropsia.class);
		return obj;
	}



}
