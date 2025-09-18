package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.LaudoNecropsia;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class LaudoNecropsiaResponse {
	private Long id;
	private String conclusao;
	private FichaSolicitacaoServicoResponse fichaSolicitacaoServico;
	private List<CampoLaudoResponse> campoLaudo;
	private List<CampoLaudoMicroscopiaResponse> campoMicroscopia;
    private String descricaoMacroscopia;
    private String descricaoMicroscopia;
	private List<EstagiarioResponse> estagiario;
	private List<FotoResponse> foto;

	public LaudoNecropsiaResponse(LaudoNecropsia obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);
	}
}