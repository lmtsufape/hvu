package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Area;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class AreaRequest {
    private long id;
	private String tituloArea;
	private List<EspecieRequest> especie;

	public Area convertToEntity() {
		ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Area.class);
	}
}
