package br.edu.ufape.hvu.repository;

import br.edu.ufape.hvu.model.ContadorServico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ContadorServicoRepository extends JpaRepository<ContadorServico, Long> {
    Optional<ContadorServico> findByTipoServicoAndAno(String tipoServico, int ano);
}
