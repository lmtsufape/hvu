package br.edu.ufape.hvu.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contador_prontuario")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ContadorProntuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;

    @Column(nullable = false)
    private int ultimoValor;

    @Column(nullable = false)
    private boolean valorInicialConfigurado;
}
