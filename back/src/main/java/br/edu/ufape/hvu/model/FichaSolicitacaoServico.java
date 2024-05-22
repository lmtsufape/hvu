package br.edu.ufape.hvu.model;

import java.util.Date;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class FichaSolicitacaoServico {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;
    private Date dataHoraObito;
    private EstadoConservacao estadoConservacao;
    private String historico;
    private String caracteristicasAdicionais;
    @OneToOne
    @ToString.Exclude
    @JoinColumn(name = "animal_id)")
    private Animal animal;
    @OneToOne
    @ToString.Exclude
    private Tutor tutor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    @ToString.Exclude
    private Medico medico;
}