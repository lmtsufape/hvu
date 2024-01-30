package br.edu.ufape.hvu.controller.dto.request;

import java.util.Date;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.ExameMicroscopico;
import br.edu.ufape.hvu.model.enums.Opcoes;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter @Setter @NoArgsConstructor 
public  class ExameMicroscopicoRequest  {
	private Opcoes opcoes;
	private String observacoes;
	private Date dataHora;
	private String foto_path;
	private OrgaoRequest orgao; 
	private EtapaRequest etapa; 
	private LaudoMicroscopiaRequest laudoMicroscopia; 
	private long id;
	private FotoRequest foto;


	public ExameMicroscopico convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		ExameMicroscopico obj = modelMapper.map(this, ExameMicroscopico.class);
		return obj;
	}



}
