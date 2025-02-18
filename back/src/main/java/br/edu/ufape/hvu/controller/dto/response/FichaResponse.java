package br.edu.ufape.hvu.controller.dto.response;

import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Ficha;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
public  class FichaResponse  {
    private long id;
    private String nome;
    private String conteudo;
    private LocalDateTime dataHora;

    public FichaResponse(Ficha obj) {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        modelMapper.map(obj, this);
    }

}
