package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Instituicao;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import br.edu.ufape.hvu.repository.InstituicaoRepository;
import br.edu.ufape.hvu.repository.MedicoRepository;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component @RequiredArgsConstructor
public class MedicoSeeder {
    private final MedicoRepository medicoRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioSeeder usuarioSeeder;


    public void init(){
        if(medicoRepository.count() > 0){
            return;
        }
        Faker faker = new Faker();
        List<Especialidade> especialidades = especialidadeRepository.findAll();
        List<Instituicao> instituicoes = instituicaoRepository.findAll();

        for(int i = 0; i < 3; i++){

            Endereco endereco = usuarioSeeder.criarEndereco(faker);
            Medico medico = criarMedico(faker, endereco, especialidades.get(0), instituicoes.get(0));

            medicoRepository.save(medico);
        }
    }

    protected Medico criarMedico(Faker faker, Endereco endereco, Especialidade especialidade, Instituicao instituicao){
        Medico medico = new Medico();
        medico.setNome(faker.name().fullName());
        medico.setEmail(faker.internet().emailAddress());
        medico.setTelefone(faker.phoneNumber().phoneNumber());
        medico.setCpf(faker.idNumber().valid());
        medico.setSenha("12345678");
        medico.setEndereco(endereco);
        medico.setCrmv(faker.idNumber().valid());
        medico.setEspecialidade(Collections.singletonList(especialidade));
        medico.setInstituicao(instituicao);

        return medico;
    }
}
