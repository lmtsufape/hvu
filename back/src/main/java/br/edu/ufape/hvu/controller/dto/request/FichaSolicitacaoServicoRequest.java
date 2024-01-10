package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class FichaSolicitacaoServicoRequest  {
	private TipoServico tipoServico;
	private TipoMaterial tipoMaterial;
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
