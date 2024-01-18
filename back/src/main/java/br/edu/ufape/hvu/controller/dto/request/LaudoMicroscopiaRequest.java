package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LaudoMicroscopia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class LaudoMicroscopiaRequest  {
	private String conclusao;
	private FichaSolicitacaoServicoRequest fichaSolicitacaoServico; 
	private CampoLaudoRequest campoLaudo; 
	private EtapaRequest etapa; 
	private List<EstagiarioRequest> estagiario;
	private long id;


	public LaudoMicroscopia convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LaudoMicroscopia obj = modelMapper.map(this, LaudoMicroscopia.class);
		return obj;
	}



}
