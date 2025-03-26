package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.model.enums.TipoFicha;
import org.modelmapper.ModelMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import br.edu.ufape.hvu.config.SpringApplicationContext;
import br.edu.ufape.hvu.model.Ficha;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Map;
import com.fasterxml.jackson.core.JsonProcessingException;


@Getter @Setter @NoArgsConstructor
public  class FichaRequest {
    private long id;
    private String nome;
    private Map<String, Object> conteudo;
    @DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
    private LocalDateTime dataHora;


    public Ficha convertToEntity() {
        ModelMapper modelMapper = (ModelMapper) SpringApplicationContext.getBean("modelMapper");
        Ficha obj = modelMapper.map(this, Ficha.class);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            obj.setConteudo(objectMapper.writeValueAsString(conteudo));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }

        return obj;
    }
}