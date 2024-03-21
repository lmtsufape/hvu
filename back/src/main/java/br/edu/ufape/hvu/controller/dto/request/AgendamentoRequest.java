package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Agendamento;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;


@Getter @Setter @NoArgsConstructor 
public  class AgendamentoRequest  {
	private long id;
	private String status;
	private boolean tipoEspecial;
	private AnimalRequest animal;
	@DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
	private LocalDateTime dataVaga;
	


	public Agendamento convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
		Agendamento obj = modelMapper.map(this, Agendamento.class);
		return obj;
	}



}
