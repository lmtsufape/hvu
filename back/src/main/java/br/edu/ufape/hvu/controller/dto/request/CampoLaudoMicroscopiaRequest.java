package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import br.edu.ufape.hvu.model.enums.Processamento;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class CampoLaudoMicroscopiaRequest {
    private long id;
    private String descricao;
    private Processamento processamento;
    private OrgaoRequest orgao;

    public CampoLaudoMicroscopia convertToEntity() {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        return modelMapper.map(this, CampoLaudoMicroscopia.class);
    }
}
