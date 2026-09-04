package br.edu.ufape.hvu.repository.seeders;


import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class EspecialidadeSeeder {
    private final EspecialidadeRepository especialidadeRepository;


    public void init(){
        if(especialidadeRepository.count() > 0){
            return;
        }
        especialidadeRepository.saveAll(
            List.of(
                new Especialidade(0,"Cardiologia", "Estudo do coração"),
                new Especialidade(0, "Castraçao", "Cirurgia de castração")

            )
        );
    }
}
