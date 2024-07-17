package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Area;
import br.edu.ufape.hvu.repository.AreaRepository;
import br.edu.ufape.hvu.repository.EspecieRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


import java.util.Collections;
import java.util.List;

@Component @RequiredArgsConstructor
public class AreaSeeder {
    final private AreaRepository areaRepository;
    final private EspecieRepository especieRepository;

    public void init(){
        if(areaRepository.count() > 0){
            return;
        }
        areaRepository.saveAll(
            List.of(
                new Area(1, "Caninologia", Collections.singletonList(especieRepository.findById(1L).get())),
                new Area(2, "Felinologia", Collections.singletonList(especieRepository.findById(2L).get()))

            )
        );
    }
}
