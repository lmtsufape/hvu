package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class FichaSolicitacaoServicoResponse  {
	private Long id;
	private TipoServico tipoServico;
	private TipoMaterial tipoMaterial;
	private Date dataHoraObito;
	private EstadoConservacao estadoConservacao;
	private String historico;
	private String caracteristicasAdicionais;
	private AnimalResponse animal; 
	private MedicoResponse medico; 



	public FichaSolicitacaoServicoResponse(FichaSolicitacaoServico obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
