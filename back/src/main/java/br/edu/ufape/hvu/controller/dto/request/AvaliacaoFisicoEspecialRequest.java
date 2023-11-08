package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.*;

import java.util.*;
import java.math.*;

import org.modelmapper.ModelMapper;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class AvaliacaoFisicoEspecialRequest  {
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


	public AvaliacaoFisicoEspecial convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		AvaliacaoFisicoEspecial obj = modelMapper.map(this, AvaliacaoFisicoEspecial.class);
		return obj;
	}



}
