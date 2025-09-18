package br.edu.ufape.hvu.controller.dto.request;

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
public class FichaSolicitacaoServicoRequest  {
    private long id;
	private String fichaClinica;
    private TipoServico tipoServico;
    private LocalDateTime dataHoraObito;
    private LocalDateTime dataRecebimento;
	private EstadoConservacao estadoConservacao;
	private Acondicionamento acondicionamento;
	private TipoMaterial material;
	private boolean eutanasia;
	private String historico;
	private String caracteristicasAdicionais;
	private TutorRequest tutor;
	private AnimalRequest animal;
	private MedicoRequest medico;

	public FichaSolicitacaoServico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, FichaSolicitacaoServico.class);
	}
}
