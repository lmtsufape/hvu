package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Area;
import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.repository.AreaRepository;
import br.edu.ufape.hvu.repository.EspecieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AreaSeeder {
    private final AreaRepository areaRepository;
    private final EspecieRepository especieRepository;

    public void init() {
        if (areaRepository.count() > 0) {
            return;
        }

        Especie especie1 = especieRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Especie com id 1 não encontrada"));
        Especie especie2 = especieRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Especie com id 2 não encontrada"));

        areaRepository.saveAll(
                List.of(
                        new Area(0, "Caninologia", especie1),
                        new Area(0, "Felinologia", especie2)
                )
        );
    }
}
