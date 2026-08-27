package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

@Getter
@Setter
@NoArgsConstructor
public class ConsultaRequestFix {

    private long id;
    private Double pesoAtual;
    private Double idadeAtual;

    private MedicoRequest medico;

    private boolean proximaConsulta;

    private AnimalRequest animal;

    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime dataVaga;

    private String queixaPrincipal;
    private String alteracoesClinicasDiversas;
    private String suspeitasClinicas;
    private String alimentacao;

    private EspecialidadeRequest encaminhamento;
}