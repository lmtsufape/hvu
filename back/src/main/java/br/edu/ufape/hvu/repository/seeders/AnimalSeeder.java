package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Raca;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.repository.RacaRepository;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;


@Component @RequiredArgsConstructor
public class AnimalSeeder {
    final private AnimalRepository animalRepository;
    final private RacaRepository racaRepository;

   // @PostConstruct
    public void init(){
        if(animalRepository.count() > 0){
            return;
        }
        Faker faker = new Faker();
        List<Raca> racas = racaRepository.findAll();
        for(int i = 0; i < 3; i++){
            Animal animal = new Animal();
            animal.setNome(faker.name().firstName());
            animal.setSexo(faker.demographic().sex());
            animal.setAlergias(faker.lorem().sentence());
            animal.setDataNascimento(LocalDate.now());
            animal.setImagem("NULL");
            animal.setCastrado(faker.bool().bool());
            animal.setPeso(faker.number().randomDouble(2, 1, 15));
            animal.setNumeroFicha(faker.idNumber().valid());
            animal.setRaca(racas.get(0));
            animalRepository.save(animal);

        }
    }
}