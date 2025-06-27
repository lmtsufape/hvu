package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Tutor;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class PatologistaAnimalRequest {

    @NotNull(message = "Dados do animal são obrigatórios")
    @Valid
    private AnimalRequest animal;

    // Tutor pode ser nulo ou anônimo
    @Valid
    private TutorRequest tutor;

    public Animal getAnimalEntity() {
        return animal.convertToEntity();
    }

    public Tutor getTutorEntity() {
        return (tutor != null) ? tutor.convertToEntity() : null;
    }
}
