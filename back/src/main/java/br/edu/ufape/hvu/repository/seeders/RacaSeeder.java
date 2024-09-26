package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Raca;
import br.edu.ufape.hvu.repository.EspecieRepository;
import br.edu.ufape.hvu.repository.RacaRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class RacaSeeder {
    final private RacaRepository racaRepository;
    final private EspecieRepository especieRepository;


    public void init(){
        if(racaRepository.count() > 0){
            return;
        }
        racaRepository.saveAll(
             List.of(new Raca(1, "Pastor Alemão", "Grande", "Raça grande e leal", especieRepository.findById(1L).get()),
                     new Raca(2, "Yorkshire", "Pequena", "Raça pequena, dócil e amigável", especieRepository.findById(1L).get()))
        );
    }
}
