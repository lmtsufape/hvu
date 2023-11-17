package br.edu.ufape.hvu.controller.dto.response;

import java.util.*;
import java.math.*;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import org.modelmapper.ModelMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Getter @Setter @NoArgsConstructor
public  class ConsultaResponse  {
	private Long id;
	private Double pesoAtual;
	private Double idadeAtual;
	private String queixaPrincipal;
	private boolean tipoConsulta;
	private String alteracoesClinicasDiversas;
	private String suspeitasClinicas;
	private String alimentacao;
	private MedicoResponse medico; 
	private AvaliacaoFisicoEspecialResponse avaliacaoFisicoEspecial; 
	private ParecerResponse parecer; 
	private AvaliacaoFisicoGeralResponse avaliacaoFisicoGeral; 
	private List<PrescricaoResponse> prescricao; 
	private List<EstagiarioResponse> estagiario; 
	private List<ExameComplementarResponse> exameComplementar; 



	public ConsultaResponse(Consulta obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
