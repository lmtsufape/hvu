package br.edu.ufape.hvu.model;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import br.edu.ufape.hvu.model.enums.Acondicionamento;
import br.edu.ufape.hvu.model.enums.EstadoConservacao;
import br.edu.ufape.hvu.model.enums.TipoMaterial;
import br.edu.ufape.hvu.model.enums.TipoServico;
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
    private String fichaClinica;
    private String codigoPatologia;
    private TipoServico tipoServico;
    private Date dataHoraObito;
    private Date dataRecebimento;
    private EstadoConservacao estadoConservacao;
    private Acondicionamento acondicionamento;
    private TipoMaterial material;
    private Boolean eutanasia;
    private String historico;
    private String caracteristicasAdicionais;
    @OneToOne
    @ToString.Exclude
    @JoinColumn(name = "animal_id)")
    private Animal animal;
    @ManyToOne
    @ToString.Exclude
    @JoinColumn(name="tutor_id")
    private Tutor tutor;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medico_id")
    @ToString.Exclude
    private Medico medico;

    private static Map<TipoServico, Integer> contadorServicos = new HashMap<>();
    private static int currentYear = new Date().getYear() + 1900;

    public void gerarCodigoPatologia() {
        if (!contadorServicos.containsKey(tipoServico) || new Date().getYear() + 1900 != currentYear) {
            resetarContadores();
        }
        int count = contadorServicos.getOrDefault(tipoServico, 0) + 1;
        contadorServicos.put(tipoServico, count);

        this.codigoPatologia = String.format("%s%04d%d", tipoServico.getCodigo(), count, currentYear);
    }

    private void resetarContadores() {
        contadorServicos.clear();
        currentYear = new Date().getYear() + 1900;
    }

}