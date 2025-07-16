package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Instituicao;
import br.edu.ufape.hvu.model.Patologista;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import br.edu.ufape.hvu.repository.InstituicaoRepository;
import br.edu.ufape.hvu.repository.PatologistaRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PatologistaSeeder {
    private final PatologistaRepository patologistaRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioSeeder usuarioSeeder;

    public void init() {
        if (patologistaRepository.count() > 0) {
            return;
        }

        Faker faker = new Faker();

        List<Especialidade> especialidades = especialidadeRepository.findAll();
        List<Instituicao> instituicoes = instituicaoRepository.findAll();

        Endereco endereco = usuarioSeeder.criarEndereco(faker);
        Patologista patologista = criarPatologista(
                faker,
                endereco,
                especialidades.get(0),
                instituicoes.get(0)
        );

        patologistaRepository.save(patologista);
    }

    protected Patologista criarPatologista(Faker faker, Endereco endereco, Especialidade especialidade, Instituicao instituicao) {
        Patologista patologista = new Patologista();
        patologista.setNome("patologista");
        patologista.setEmail("patologista@patologista.com");
        patologista.setTelefone(faker.phoneNumber().cellPhone());
        patologista.setCpf(faker.idNumber().valid());
        patologista.setDeleted(false);
        patologista.setEndereco(endereco);
        patologista.setCrmv(faker.idNumber().valid());
        patologista.setEspecialidade(Collections.singletonList(especialidade));
        patologista.setInstituicao(instituicao);
        patologista.setUserId("db15a5e9-c0ad-4ea3-903c-142a3e08dbe7"); // UUID do Keycloak

        return patologista;
    }

}
