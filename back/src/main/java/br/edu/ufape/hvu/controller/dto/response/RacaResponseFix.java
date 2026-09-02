package br.edu.ufape.hvu.controller.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RacaResponseFix {

    private Long id;
    private String nome;
    private String porte;
    private String descricao;
    private EspecieResponse especie;
}