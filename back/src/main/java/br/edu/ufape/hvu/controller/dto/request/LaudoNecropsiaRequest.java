package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LaudoNecropsia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor
public class LaudoNecropsiaRequest {
	private String conclusao;
	private FichaSolicitacaoServicoRequest fichaSolicitacaoServico;
	private List<CampoLaudoRequest> campoLaudo;
	private List<CampoLaudoMicroscopiaRequest> campoMicroscopia;
	private List<EstagiarioRequest> estagiario;
	private List<FotoRequest> foto;
	private long id;

	public LaudoNecropsia convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		LaudoNecropsia obj = modelMapper.map(this, LaudoNecropsia.class);
		return obj;
	}
}
