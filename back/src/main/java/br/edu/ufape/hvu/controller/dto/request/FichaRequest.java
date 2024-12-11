package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.model.enums.TipoFicha;
import org.modelmapper.ModelMapper;

import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Ficha;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter @Setter @NoArgsConstructor
public  class FichaRequest  {
    private long id;
    private String nome;
    private String conteudo;
    private LocalDateTime dataHora;


    public Ficha convertToEntity() {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        Ficha obj = modelMapper.map(this, Ficha.class);
        return obj;
    }

}
