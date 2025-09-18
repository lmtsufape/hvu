package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;
import br.edu.ufape.hvu.model.enums.Acondicionamento;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class FichaSolicitacaoServicoResponse {
	private Long id;
	private String fichaClinica;
	private String codigoPatologia;
	private TipoServico tipoServico;
    private LocalDateTime dataHoraObito;
    private LocalDateTime dataRecebimento;
	private EstadoConservacao estadoConservacao;
	private Acondicionamento acondicionamento;
	private TipoMaterial material;
	private Boolean eutanasia;
	private String historico;
	private String caracteristicasAdicionais;
	private TutorResponse tutor;
	private AnimalResponse animal; 
	private MedicoResponse medico;

	public FichaSolicitacaoServicoResponse(FichaSolicitacaoServico obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}
}
