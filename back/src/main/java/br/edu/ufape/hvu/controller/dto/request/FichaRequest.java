package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.exception.InvalidJsonException;
import br.edu.ufape.hvu.model.Ficha;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.Map;


@Getter @Setter @NoArgsConstructor
public  class FichaRequest {
    private long id;
    private String nome;
    private Map<String, Object> conteudo;

    @DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
    private LocalDateTime dataHora;

    public Ficha convertToEntity() {
        Ficha ficha = new Ficha();
        ficha.setId(this.id);
        ficha.setNome(this.nome);
        ficha.setDataHora(this.dataHora);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String conteudoJson = objectMapper.writeValueAsString(this.conteudo);
            ficha.setConteudo(conteudoJson);
        } catch (JsonProcessingException e) {
            throw new InvalidJsonException("Erro ao converter o campo 'conteudo' para JSON válido.", e);
        }

        return ficha;
    }

    public void applyToEntity(Ficha ficha) {
        ficha.setNome(this.nome);
        ficha.setDataHora(this.dataHora);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String conteudoJson = objectMapper.writeValueAsString(this.conteudo);
            ficha.setConteudo(conteudoJson);
        } catch (JsonProcessingException e) {
            throw new InvalidJsonException("Erro ao converter o campo 'conteudo' para JSON válido.", e);
        }
    }
}
