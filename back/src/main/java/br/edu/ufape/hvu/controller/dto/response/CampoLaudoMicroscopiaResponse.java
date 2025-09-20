package br.edu.ufape.hvu.controller.dto.response;

import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import br.edu.ufape.hvu.model.enums.Processamento;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public  class CampoLaudoMicroscopiaResponse  {
    private Long id;
    private String descricao;
    private Processamento processamento;
    private OrgaoResponse orgao;

    public CampoLaudoMicroscopiaResponse(CampoLaudoMicroscopia obj) {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        modelMapper.map(obj, this);
    }
}
