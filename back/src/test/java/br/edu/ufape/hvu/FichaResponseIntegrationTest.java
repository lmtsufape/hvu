package br.edu.ufape.hvu;

import br.edu.ufape.hvu.controller.dto.response.FichaResponse;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Ficha;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.repository.FichaRepository;
import br.edu.ufape.hvu.repository.MedicoRepository;
import br.edu.ufape.hvu.repository.VagaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ActiveProfiles("test")
@Testcontainers
@SpringBootTest
class FichaResponseIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16.0")
            .withDatabaseName("hvu_test")
            .withUsername("postgres")
            .withPassword("password")
            .withUrlParam("stringtype", "unspecified");

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private VagaRepository vagaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private FichaRepository fichaRepository;

    @BeforeEach
    void limparBanco() {
        fichaRepository.deleteAll();
        vagaRepository.deleteAll();
        agendamentoRepository.deleteAll();
        animalRepository.deleteAll();
        medicoRepository.deleteAll();
    }

    @Test
    @Transactional
    void fichaResponseDistingueMedicoCriadorDoMedicoResponsavel() {
        Medico criador = criarMedico("Criador", "criador@example.com", "criador-user");
        Medico responsavel = criarMedico("Responsavel", "responsavel@example.com", "responsavel-user");

        Animal animal = criarAnimal();
        Agendamento agendamento = criarAgendamento(animal);
        criarVaga(responsavel, agendamento);

        Ficha ficha = new Ficha();
        ficha.setNome("Ficha Clínica Médica");
        ficha.setConteudo("{}");
        ficha.setDataHora(LocalDateTime.now());
        ficha.setAnimal(animal);
        ficha.setMedico(criador);
        ficha.setAgendamento(agendamento);
        fichaRepository.save(ficha);

        FichaResponse response = new FichaResponse(ficha);

        assertEquals("Criador", response.getMedico().getNome());
        assertEquals("Responsavel", response.getMedicoResponsavel().getNome());
    }

    private Medico criarMedico(String nome, String email, String userId) {
        Medico medico = new Medico();
        medico.setNome(nome);
        medico.setEmail(email);
        medico.setUserId(userId);
        medico.setCrmv("1234");
        return medicoRepository.save(medico);
    }

    private Animal criarAnimal() {
        Animal animal = new Animal();
        animal.setNome("Paciente Teste");
        animal.setSexo("Macho");
        animal.setPeso(10.0);
        animal.setTipo(TipoAnimal.COMUM);
        animal.setOrigemAnimal(OrigemAnimal.HVU);
        return animalRepository.save(animal);
    }

    private Agendamento criarAgendamento(Animal animal) {
        Agendamento agendamento = new Agendamento();
        agendamento.setAnimal(animal);
        agendamento.setDataVaga(LocalDateTime.now());
        return agendamentoRepository.save(agendamento);
    }

    private Vaga criarVaga(Medico medicoResponsavel, Agendamento agendamento) {
        Vaga vaga = new Vaga();
        vaga.setMedico(medicoResponsavel);
        vaga.setAgendamento(agendamento);
        vaga.setStatus("Disponivel");
        vaga.setDataHora(LocalDateTime.now());
        return vagaRepository.save(vaga);
    }
}
