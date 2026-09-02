package br.edu.ufape.hvu.controller.dto.response;

import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AnimalResponseFix {

    private long id;
    private String nome;
    private String sexo;
    private String alergias;
    private LocalDate dataNascimento;
    private String imagem;
    private boolean castrado;
    private double peso;
    private String numeroFicha;
    private RacaResponseFix raca;
    private OrigemAnimal origemAnimal;
    private boolean obito;
    private String codigoProntuario;
    private TipoAnimal tipo;
}