package br.edu.ufape.hvu.controller.dto.response;

import br.edu.ufape.hvu.model.ContadorProntuario;

public record ContadorProntuarioResponse(
        int ultimoValor,
        boolean valorInicialConfigurado
) {
    public ContadorProntuarioResponse(ContadorProntuario contador) {
        this(
                contador.getUltimoValor(),
                contador.isValorInicialConfigurado()
        );
    }
}