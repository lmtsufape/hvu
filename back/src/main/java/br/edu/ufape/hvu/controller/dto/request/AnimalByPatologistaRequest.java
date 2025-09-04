package br.edu.ufape.hvu.controller.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AnimalByPatologistaRequest {
    @NotNull
    @Valid
    private AnimalRequest animal;

    private Long tutorId;       // se informado → busca tutor no banco
    private TutorRequest tutor; // se informado → cria novo tutor
    private boolean anonimo;    // se true → busca tutor anônimo global
}