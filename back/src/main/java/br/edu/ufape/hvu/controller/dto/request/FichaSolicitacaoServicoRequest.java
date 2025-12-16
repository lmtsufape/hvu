package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.model.enums.Acondicionamento;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;
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
		FichaSolicitacaoServico ficha = new FichaSolicitacaoServico();

		ficha.setFichaClinica(this.fichaClinica);
		ficha.setTipoServico(this.tipoServico);
		ficha.setDataHoraObito(this.dataHoraObito);
		ficha.setDataRecebimento(this.dataRecebimento);
		ficha.setEstadoConservacao(this.estadoConservacao);
		ficha.setAcondicionamento(this.acondicionamento);
		ficha.setMaterial(this.material);
		ficha.setEutanasia(this.eutanasia);
		ficha.setHistorico(this.historico);
		ficha.setCaracteristicasAdicionais(this.caracteristicasAdicionais);

		if (this.animal != null) {
			ficha.setAnimal(new Animal());
			ficha.getAnimal().setId(this.animal.getId());
		}
		if (this.tutor != null) {
			ficha.setTutor(new Tutor());
			ficha.getTutor().setId(this.tutor.getId());
		}
		if (this.medico != null) {
			ficha.setMedico(new Medico());
			ficha.getMedico().setId(this.medico.getId());
		}

		return ficha;
	}
}
