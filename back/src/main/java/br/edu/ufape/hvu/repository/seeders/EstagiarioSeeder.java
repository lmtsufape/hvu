package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Estagiario;
import br.edu.ufape.hvu.repository.EstagiarioRepository;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class EstagiarioSeeder {
    private final EstagiarioRepository estagiarioRepository;

    //@PostConstruct
    public void init(){
        if(estagiarioRepository.count() > 0){
            return;
        }
        Faker faker = new Faker();
        for(int i = 0; i < 3; i++){
            Estagiario estagiario = new Estagiario();
            estagiario.setNome(faker.name().fullName());
            estagiario.setCpf(faker.idNumber().valid());
            estagiario.setPeriodo("2021.1");
            estagiario.setObrigatorio(true);
            estagiario.setAtivo(true);
            estagiarioRepository.save(estagiario);
        }
    }
}
