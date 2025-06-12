package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.exception.InvalidJsonException;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;

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
            String conteudoJson = objectMapper.writeValueAsString(conteudo);
            obj.setConteudo(conteudoJson);
        } catch (JsonProcessingException e) {
            throw new InvalidJsonException("Erro ao converter o campo 'conteudo' para JSON válido.", e);
        }

        return obj;
    }
}