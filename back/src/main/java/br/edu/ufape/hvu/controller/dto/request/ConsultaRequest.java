package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Consulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;


@Getter @Setter @NoArgsConstructor 
public  class ConsultaRequest  {
	private Double pesoAtual;
	private Double idadeAtual;
	private String queixaPrincipal;
	private boolean tipoConsulta;
	private String alteracoesClinicasDiversas;
	private String suspeitasClinicas;
	private String alimentacao;
	private MedicoRequest medico;
	private EspecialidadeRequest encaminhamento;
	private ParecerRequest parecer; 
	private AvaliacaoFisicoGeralRequest avaliacaoFisicoGeral; 
	private List<PrescricaoRequest> prescricao; 
	private List<EstagiarioRequest> estagiario; 
	private List<ExameComplementarRequest> exameComplementar;
	private long id;
	private boolean proximaConsulta;
	private AnimalRequest animal;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;


	public Consulta convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Consulta obj = modelMapper.map(this, Consulta.class);
		return obj;
	}



}
