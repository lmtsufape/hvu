package br.edu.ufape.hvu.controller.dto.request;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class FichaSolicitacaoServicoRequest  {
	private boolean criarLaudoNecropsia; //indica se deve criar o laudo de necropsia
	private boolean criarLaudoMicroscopia; //indica se deve criar o laudo de microscopia
	private Date dataHoraObito;
	private EstadoConservacao estadoConservacao;
	private String historico;
	private String caracteristicasAdicionais;
	private AnimalRequest animal; 
	private MedicoRequest medico;
	private long id;



	public FichaSolicitacaoServico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		FichaSolicitacaoServico obj = modelMapper.map(this, FichaSolicitacaoServico.class);
		return obj;
	}



}
