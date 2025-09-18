package br.edu.ufape.hvu.controller.dto.request;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Raca;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class RacaRequest {
    private long id;
	private String nome;
	private String porte;
	private String descricao;
	private EspecieRequest especie;

	public Raca convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Raca.class);
	}
}
