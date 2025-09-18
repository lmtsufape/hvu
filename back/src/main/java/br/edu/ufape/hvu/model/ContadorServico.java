package br.edu.ufape.hvu.model;

import br.edu.ufape.hvu.model.enums.TipoServico;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContadorServico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Enumerated(EnumType.STRING)
    private TipoServico tipoServico;

    private int ano;
    private int ultimoValor;
}
