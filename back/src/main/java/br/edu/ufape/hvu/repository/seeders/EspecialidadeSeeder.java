package br.edu.ufape.hvu.repository.seeders;


import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class EspecialidadeSeeder {
    private final EspecialidadeRepository especialidadeRepository;

    @PostConstruct
    public void init(){
        if(especialidadeRepository.count() > 0){
            return;
        }
        especialidadeRepository.saveAll(
            List.of(
                new Especialidade(1,"Cardiologia", "Estudo do coração"),
                new Especialidade(2, "Castraçao", "Cirurgia de castração")

            )
        );
    }
}
