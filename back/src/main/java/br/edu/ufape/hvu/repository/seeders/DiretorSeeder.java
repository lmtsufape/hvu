package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Diretor;
import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.repository.DiretorRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class DiretorSeeder {
    final private DiretorRepository diretorRepository;
    final private UsuarioSeeder usuarioSeeder;

    public void init(){
        if(diretorRepository.count() > 0){
            return;
        }

        Faker faker = new Faker(new Locale("pt-BR"));


        Endereco endereco = usuarioSeeder.criarEndereco(faker);

        Diretor diretor = criarDiretor(faker, endereco);

        diretorRepository.save(diretor);



    }

    protected Diretor criarDiretor(Faker faker, Endereco endereco){
        Diretor diretor = new Diretor();
        diretor.setNome("diretor");
        diretor.setEmail("diretor@diretor.com");
        diretor.setTelefone(faker.phoneNumber().phoneNumber());
        diretor.setDeleted(false);
        diretor.setCpf(faker.idNumber().valid());
        diretor.setEndereco(endereco);
        diretor.setMatricula(faker.idNumber().valid());
        diretor.setUserId("cee73780-6579-4c61-a53a-37a4259f4514");
        return diretor;
    }
}