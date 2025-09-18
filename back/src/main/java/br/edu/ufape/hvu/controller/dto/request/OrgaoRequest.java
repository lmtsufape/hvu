package br.edu.ufape.hvu.controller.dto.request;

import java.util.List;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Foto;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Orgao;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class OrgaoRequest {
    private long id;
	private String nome;
	private Boolean sexoMacho;
	private Boolean sexoFemea;
	private List<AreaRequest> area;
	private FotoRequest foto;

    public Orgao convertToEntity() {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, Orgao.class);
    }
}
