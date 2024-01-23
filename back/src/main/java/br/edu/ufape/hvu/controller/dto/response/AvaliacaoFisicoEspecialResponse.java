package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.AvaliacaoFisicoEspecial;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class AvaliacaoFisicoEspecialResponse  {
	private Long id;
	private String sistemaRespiratorio;
	private String sistemaDigestorio;
	private String sistemaCardioVascular;
	private String sistemaNefrourinario;
	private String pele;
	private String ouvidos;
	private String sistemaNeurologico;
	private String sistemaLocomotor;
	private String sistemaReprodutor;
	private String olhos;



	public AvaliacaoFisicoEspecialResponse(AvaliacaoFisicoEspecial obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
