package br.edu.ufape.hvu.controller.dto.response;

public record TutorEAnimalPorOrigemFlatResponse(
    Long tutorId,
    String tutorNome,
    String tutorCpf,
    Long animalId,
    String animalNome
) {}
