package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.repository.EspecieRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class EspecieSeeder {
    private final EspecieRepository especieRepository;

    @PostConstruct
    public void init(){
        if(especieRepository.count() > 0){
            return;
        }
        especieRepository.saveAll(
            List.of(
                new Especie(1, "Canina", "Cachorros"),
                new Especie(2, "Felina", "Gatos"),
                new Especie(3, "Srigiformes" ,"Corujas")

            )
        );
    }
}
