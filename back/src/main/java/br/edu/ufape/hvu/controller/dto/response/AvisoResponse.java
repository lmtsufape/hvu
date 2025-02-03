package br.edu.ufape.hvu.controller.dto.response;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Aviso;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.modelmapper.ModelMapper;

@Getter
@Setter
@NoArgsConstructor
public class AvisoResponse {
    private Long id;
    private String texto;
    private boolean habilitado;



    public AvisoResponse(Aviso obj) {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        modelMapper.map(obj, this);
    }
}
