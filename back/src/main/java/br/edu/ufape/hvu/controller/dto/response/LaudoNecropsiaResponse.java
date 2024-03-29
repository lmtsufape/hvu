package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LaudoNecropsia;
import br.edu.ufape.hvu.model.enums.Microscopia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class LaudoNecropsiaResponse  {
	private Long id;
	private String fichaClinica;
	private String ficha;
	private Microscopia tipoMicroscopia;
	private String conclusao;
	private FichaSolicitacaoServicoResponse fichaSolicitacaoServico; 
	private CampoLaudoResponse campoLaudo; 
	private LaudoMicroscopiaResponse laudoMicroscopia; 
	private FotoResponse foto; 
	private List<EstagiarioResponse> estagiario; 



	public LaudoNecropsiaResponse(LaudoNecropsia obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
