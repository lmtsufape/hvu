package br.edu.ufape.hvu.controller.dto.request;

import java.time.LocalDate;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
public class AnimalRequestFix {

    private long id;

    @NotBlank(message = "Nome não pode estar em branco")
    private String nome;

    @NotBlank(message = "Sexo não pode estar em branco")
    private String sexo;

    private String alergias;
    private LocalDate dataNascimento;
    private String imagem;
    private boolean castrado;

    private double peso;

    @NotNull(message = "Raça é obrigatória")
    private RacaRequest raca;

    private OrigemAnimal origemAnimal;
    private boolean obito;
    private TipoAnimal tipo;
}
