package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.ContadorServico;
import br.edu.ufape.hvu.model.enums.TipoServico;
import br.edu.ufape.hvu.repository.ContadorServicoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class CodigoPatologiaService {
    private final ContadorServicoRepository contadorServicoRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public String gerarCodigo(TipoServico tipoServico) {
        int anoAtual = LocalDate.now().getYear();

        ContadorServico contador = entityManager.createQuery(
                        "SELECT c FROM ContadorServico c WHERE c.tipoServico = :tipo AND c.ano = :ano",
                        ContadorServico.class)
                .setParameter("tipo", tipoServico)
                .setParameter("ano", anoAtual)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getResultStream()
                .findFirst()
                .orElseGet(() -> {
                    ContadorServico novo = new ContadorServico();
                    novo.setTipoServico(tipoServico);
                    novo.setAno(anoAtual);
                    novo.setUltimoValor(0);
                    return novo;
                });

        contador.setUltimoValor(contador.getUltimoValor() + 1);
        contadorServicoRepository.save(contador);

        return String.format("%s%d%04d", tipoServico.getCodigo(), anoAtual, contador.getUltimoValor());
    }
}
