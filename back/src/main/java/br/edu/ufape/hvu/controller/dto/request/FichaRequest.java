package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.exception.InvalidJsonException;
import br.edu.ufape.hvu.model.Ficha;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;
import java.util.Map;

@Getter @Setter @NoArgsConstructor
public class FichaRequest {
    @NotBlank(message = "O campo 'nome' é obrigatório e não pode ser vazio.")
    private String nome;

    @NotNull(message = "O campo 'conteudo' é obrigatório.")
    private Map<String, Object> conteudo;

    @NotNull(message = "O campo 'dataHora' é obrigatório.")
    @DateTimeFormat(pattern = "dd/MM/yyyy hh:mm")
    private LocalDateTime dataHora;

    private AgendamentoRequest agendamento;

    public Ficha convertToEntity() {
        Ficha ficha = new Ficha();
        ficha.setNome(this.nome);
        ficha.setDataHora(this.dataHora);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String conteudoJson = objectMapper.writeValueAsString(this.conteudo);
            ficha.setConteudo(conteudoJson);
        } catch (JsonProcessingException e) {
            throw new InvalidJsonException("Erro ao converter o campo 'conteudo' para JSON válido.", e);
        }

        if (this.agendamento != null) {
            ficha.setAgendamento(this.agendamento.convertToEntity());
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

        if (this.agendamento != null) {
            ficha.setAgendamento(this.agendamento.convertToEntity());
        }
    }
}
