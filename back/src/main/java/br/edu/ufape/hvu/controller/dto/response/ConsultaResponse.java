package br.edu.ufape.hvu.controller.dto.response;

import java.util.List;

import br.edu.ufape.hvu.model.Animal;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Consulta;
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
	private boolean proximaConsulta;
	private EspecialidadeResponse encaminhamento;
	private AnimalResponse animal;



	public ConsultaResponse(Consulta obj) {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		modelMapper.map(obj, this);	
	}

}
