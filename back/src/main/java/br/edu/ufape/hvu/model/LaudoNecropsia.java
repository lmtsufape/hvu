package br.edu.ufape.hvu.model;

import java.util.List;

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
public class LaudoNecropsia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private long id;
    private String conclusao;
    @OneToOne
    @ToString.Exclude
    private FichaSolicitacaoServico fichaSolicitacaoServico;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "campoLaudo_id")
    @ToString.Exclude
    private List<CampoLaudo> campoLaudo;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "campoLaudoMicroscopia_id")
    @ToString.Exclude
    private List<CampoLaudoMicroscopia> campoMicroscopia;
    @ManyToMany
    @ToString.Exclude
    private List<Estagiario> estagiario;
    @OneToMany
    private List<Foto> foto;

}