package br.edu.ufape.hvu.model;

import java.util.Date;

import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import br.edu.ufape.hvu.repository.FichaSolicitacaoServicoRepository;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.beans.factory.annotation.Autowired;

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
    private boolean criarLaudoNecropsia; //indica se deve criar o laudo de necropsia
    private boolean criarLaudoMicroscopia; //indica se deve criar o laudo de microscopia
    private Date dataHoraObito;
    private EstadoConservacao estadoConservacao;
    private String historico;
    private String caracteristicasAdicionais;
    @OneToOne
    @ToString.Exclude
    private Animal animal;
    @OneToOne
    @ToString.Exclude
    private Tutor tutor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    @ToString.Exclude
    private Medico medico;
    @OneToOne
    @JoinColumn(name = "laudoNecropsia_id")
    @ToString.Exclude
    private LaudoNecropsia laudoNecropsia;
    @OneToOne
    @JoinColumn(name = "laudoMicroscopia_id")
    @ToString.Exclude
    private LaudoMicroscopia laudoMicroscopia;
}