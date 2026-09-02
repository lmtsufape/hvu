package br.edu.ufape.hvu.controller.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ValorInicialProntuarioRequest(

        @NotNull(message = "Valor inicial não pode estar em branco")
        @Min(value = 1, message = "Valor inicial deve ser maior ou igual a 1")
        Integer valorInicial
) {}