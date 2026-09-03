package br.edu.ufape.hvu.controller.dto.response;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ConsultaResponseFix {

    private Long id;
    private Double pesoAtual;
    private Double idadeAtual;
    private MedicoResponse medico;
    private boolean proximaConsulta;
    private AnimalResponseFix animal;
    private LocalDateTime dataVaga;
    private String queixaPrincipal;
    private String alteracoesClinicasDiversas;
    private String suspeitasClinicas;
    private String alimentacao;
    private EspecialidadeResponse encaminhamento;
}