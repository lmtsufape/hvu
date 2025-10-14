package br.edu.ufape.hvu.controller.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.TipoConsulta;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class TipoConsultaRequest {
    private long id;
	@NotBlank(message = "Tipo não pode está vazinho")
	private String tipo;

	public TipoConsulta convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, TipoConsulta.class);
	}
}
