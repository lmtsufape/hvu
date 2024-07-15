package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Instituicao;
import br.edu.ufape.hvu.repository.InstituicaoRepository;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class InstituicaoSeeder {
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioSeeder usuarioSeeder;


    public void init(){
        if(instituicaoRepository.count() > 0) {
            return;
        }
        Faker faker = new Faker();
        for(int i = 0; i < 3; i++){
            Endereco endereco = usuarioSeeder.criarEndereco(faker);
            instituicaoRepository.save(new Instituicao(1, "UFAPE", endereco));

        }
    }
}
