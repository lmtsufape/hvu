package br.edu.ufape.hvu.repository.seeders;


import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.repository.TutorRepository;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component @RequiredArgsConstructor
public class TutorSeeder {
    final private TutorRepository tutorRepository;
    final private UsuarioSeeder usuarioSeeder;

   // @PostConstruct
    public void init(){
        if(tutorRepository.count() > 0){
            return;
        }

        Faker faker = new Faker(new Locale("pt-BR"));

        for(int i = 0; i < 3; i++){
            Endereco endereco = usuarioSeeder.criarEndereco(faker);

            Tutor tutor = criarTutor(faker, endereco);

            tutorRepository.save(tutor);


        }
    }

    protected Tutor criarTutor(Faker faker, Endereco endereco){
        Tutor tutor = new Tutor();
        tutor.setNome(faker.name().fullName());
        tutor.setEmail(faker.internet().emailAddress());
        tutor.setTelefone(faker.phoneNumber().phoneNumber());
        tutor.setCpf(faker.idNumber().valid());
        tutor.setSenha("12345678");
        tutor.setEndereco(endereco);
        tutor.setRg(faker.idNumber().valid());
        return tutor;
    }
}
