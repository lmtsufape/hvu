package br.edu.ufape.hvu.model;

import java.time.LocalDateTime;
import br.edu.ufape.hvu.model.enums.Acondicionamento;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;
import jakarta.persistence.*;
import lombok.*;

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

    private String fichaClinica;
    private String codigoPatologia;

    @Enumerated(EnumType.STRING)
    private TipoServico tipoServico;

    private LocalDateTime dataHoraObito;
    private LocalDateTime dataRecebimento;

    @Enumerated(EnumType.STRING)
    private EstadoConservacao estadoConservacao;

    @Enumerated(EnumType.STRING)
    private Acondicionamento acondicionamento;

    @Enumerated(EnumType.STRING)
    private TipoMaterial material;

    private boolean eutanasia;
    private String historico;
    private String caracteristicasAdicionais;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    @ToString.Exclude
    private Medico medico;
}
