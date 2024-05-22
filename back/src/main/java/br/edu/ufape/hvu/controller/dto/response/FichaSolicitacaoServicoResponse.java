package br.edu.ufape.hvu.controller.dto.response;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class FichaSolicitacaoServicoResponse  {
	private Long id;
	private Date dataHoraObito;
	private EstadoConservacao estadoConservacao;
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
