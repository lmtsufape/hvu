package br.edu.ufape.hvu;

import br.edu.ufape.hvu.controller.dto.request.AgendamentoRequest;
import br.edu.ufape.hvu.controller.dto.request.AnimalRequest;
import br.edu.ufape.hvu.controller.dto.request.EspecialidadeRequest;
import br.edu.ufape.hvu.controller.dto.request.MedicoRequest;
import br.edu.ufape.hvu.controller.dto.request.TipoConsultaRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaCreateRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaTipoRequest;
import br.edu.ufape.hvu.exception.types.BusinessException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.model.TipoConsulta;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.model.enums.StatusAgendamentoEVaga;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import br.edu.ufape.hvu.repository.MedicoRepository;
import br.edu.ufape.hvu.repository.TipoConsultaRepository;
import br.edu.ufape.hvu.repository.VagaRepository;
import br.edu.ufape.hvu.service.KeycloakService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.lenient;

@ActiveProfiles("test")
@Testcontainers
@SpringBootTest
class VagaAgendamentoIntegrationTest {

    private static final String SESSION = "secretario-user-id";

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
    private Facade facade;

    @Autowired
    private VagaRepository vagaRepository;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private EspecialidadeRepository especialidadeRepository;

    @Autowired
    private TipoConsultaRepository tipoConsultaRepository;

    @MockitoBean
    private KeycloakService keycloakService;

    @BeforeEach
    void configurar() {
        vagaRepository.deleteAll();
        agendamentoRepository.deleteAll();
        animalRepository.deleteAll();
        medicoRepository.deleteAll();
        especialidadeRepository.deleteAll();
        tipoConsultaRepository.deleteAll();

        lenient().when(keycloakService.hasRoleSecretario(SESSION)).thenReturn(true);
        lenient().when(keycloakService.hasRoleMedico(SESSION)).thenReturn(false);
        lenient().when(keycloakService.hasRoleTutor(SESSION)).thenReturn(false);
        lenient().when(keycloakService.hasRolePatologista(SESSION)).thenReturn(false);
    }

    @Test
    void criarVagasSemanais_naoDuplicaHorariosExistentes() {
        Medico medico = criarMedico();
        Especialidade especialidade = criarEspecialidade();
        TipoConsulta tipoConsulta = criarTipoConsulta();

        LocalDate segunda = proximaSegunda();
        VagaCreateRequest request = vagaCreateRequest(segunda, List.of(
                vagaTipoRequest(especialidade, tipoConsulta, medico, LocalTime.of(8, 0)),
                vagaTipoRequest(especialidade, tipoConsulta, medico, LocalTime.of(9, 0))));

        facade.createVagasByTurno(request, SESSION);
        assertEquals(2, vagaRepository.findAll().size());

        // Reexecutar a criação semanal não deve duplicar as vagas existentes.
        facade.createVagasByTurno(request, SESSION);
        assertEquals(2, vagaRepository.findAll().size());
    }

    @Test
    void criarVagasSemanais_ignoraHorarioRepetidoNoMesmoRequest() {
        Medico medico = criarMedico();
        Especialidade especialidade = criarEspecialidade();
        TipoConsulta tipoConsulta = criarTipoConsulta();

        LocalDate segunda = proximaSegunda();
        VagaCreateRequest request = vagaCreateRequest(segunda, List.of(
                vagaTipoRequest(especialidade, tipoConsulta, medico, LocalTime.of(8, 0)),
                vagaTipoRequest(especialidade, tipoConsulta, medico, LocalTime.of(8, 0))));

        facade.createVagasByTurno(request, SESSION);

        assertEquals(1, vagaRepository.findAll().size());
    }

    @Test
    void vagaNaoAceitaSegundoAgendamento() {
        Animal animal = criarAnimal();
        Medico medico = criarMedico();
        Especialidade especialidade = criarEspecialidade();
        TipoConsulta tipoConsulta = criarTipoConsulta();
        Vaga vaga = criarVaga(medico, especialidade, tipoConsulta, proximaSegunda().atTime(8, 0));

        Agendamento agendamento = facade.saveAgendamento(agendamentoRequest(animal), vaga.getId(), SESSION);

        assertEquals(String.valueOf(StatusAgendamentoEVaga.Agendado), agendamento.getStatus());
        assertEquals(vaga.getDataHora(), agendamento.getDataVaga());
        assertEquals(1, agendamentoRepository.count());

        assertThrows(BusinessException.class,
                () -> facade.saveAgendamento(agendamentoRequest(animal), vaga.getId(), SESSION));

        assertEquals(1, agendamentoRepository.count());
    }

    @Test
    void statusDeAgendamentoEVagaContinuamFuncionando() {
        Animal animal = criarAnimal();
        Medico medico = criarMedico();
        Especialidade especialidade = criarEspecialidade();
        TipoConsulta tipoConsulta = criarTipoConsulta();
        Vaga vaga = criarVaga(medico, especialidade, tipoConsulta, proximaSegunda().atTime(8, 0));

        Agendamento agendamento = facade.saveAgendamento(agendamentoRequest(animal), vaga.getId(), SESSION);

        Vaga vagaOcupada = vagaRepository.findById(vaga.getId()).orElseThrow();
        assertEquals(String.valueOf(StatusAgendamentoEVaga.Agendado), vagaOcupada.getStatus());
        assertEquals(agendamento.getId(), vagaOcupada.getAgendamento().getId());

        facade.deleteAgendamento(agendamento.getId());

        Vaga vagaLiberada = vagaRepository.findById(vaga.getId()).orElseThrow();
        assertEquals(String.valueOf(StatusAgendamentoEVaga.Disponivel), vagaLiberada.getStatus());
        assertEquals(0, agendamentoRepository.count());
    }

    @Test
    void saveVagaIndividual_impedeVagaDuplicadaParaMesmoMedicoEHorario() {
        Medico medico = criarMedico();
        Especialidade especialidade = criarEspecialidade();
        TipoConsulta tipoConsulta = criarTipoConsulta();

        Vaga vaga = new Vaga();
        vaga.setMedico(medico);
        vaga.setEspecialidade(especialidade);
        vaga.setTipoConsulta(tipoConsulta);
        vaga.setDataHora(proximaSegunda().atTime(8, 0));
        facade.saveVaga(vaga);

        Vaga duplicada = new Vaga();
        duplicada.setMedico(medico);
        duplicada.setEspecialidade(especialidade);
        duplicada.setTipoConsulta(tipoConsulta);
        duplicada.setDataHora(proximaSegunda().atTime(8, 0));

        BusinessException exception = assertThrows(BusinessException.class, () -> facade.saveVaga(duplicada));
        assertTrue(exception.getMessage().contains("horário"));
        assertEquals(1, vagaRepository.count());
    }

    private AgendamentoRequest agendamentoRequest(Animal animal) {
        AgendamentoRequest request = new AgendamentoRequest();
        AnimalRequest animalRequest = new AnimalRequest();
        animalRequest.setId(animal.getId());
        request.setAnimal(animalRequest);
        return request;
    }

    private VagaCreateRequest vagaCreateRequest(LocalDate data, List<VagaTipoRequest> turnoManha) {
        VagaCreateRequest request = new VagaCreateRequest();
        request.setData(data);
        request.setDataFinal(data);
        request.setTurnoManha(turnoManha);
        request.setTurnoTarde(List.of());
        return request;
    }

    private VagaTipoRequest vagaTipoRequest(Especialidade especialidade, TipoConsulta tipoConsulta,
            Medico medico, LocalTime horario) {
        EspecialidadeRequest especialidadeRequest = new EspecialidadeRequest();
        especialidadeRequest.setId(especialidade.getId());

        TipoConsultaRequest tipoConsultaRequest = new TipoConsultaRequest();
        tipoConsultaRequest.setId(tipoConsulta.getId());

        MedicoRequest medicoRequest = new MedicoRequest();
        medicoRequest.setId(medico.getId());

        VagaTipoRequest vagaTipoRequest = new VagaTipoRequest();
        vagaTipoRequest.setEspecialidade(especialidadeRequest);
        vagaTipoRequest.setTipoConsulta(tipoConsultaRequest);
        vagaTipoRequest.setMedico(medicoRequest);
        vagaTipoRequest.setHorario(horario);
        return vagaTipoRequest;
    }

    private Vaga criarVaga(Medico medico, Especialidade especialidade, TipoConsulta tipoConsulta,
            LocalDateTime dataHora) {
        Vaga vaga = new Vaga();
        vaga.setMedico(medico);
        vaga.setEspecialidade(especialidade);
        vaga.setTipoConsulta(tipoConsulta);
        vaga.setDataHora(dataHora);
        vaga.setStatus(String.valueOf(StatusAgendamentoEVaga.Disponivel));
        return vagaRepository.save(vaga);
    }

    private Animal criarAnimal() {
        Animal animal = new Animal();
        animal.setNome("Paciente Teste");
        animal.setSexo("Macho");
        animal.setPeso(10.0);
        animal.setTipo(TipoAnimal.COMUM);
        animal.setOrigemAnimal(OrigemAnimal.HVU);
        animal.setObito(false);
        return animalRepository.save(animal);
    }

    private Medico criarMedico() {
        Medico medico = new Medico();
        medico.setNome("Médico Teste");
        medico.setEmail("medico@teste.com");
        medico.setUserId("medico-user-id");
        medico.setCrmv("1234");
        return medicoRepository.save(medico);
    }

    private Especialidade criarEspecialidade() {
        Especialidade especialidade = new Especialidade();
        especialidade.setNome("Clínica Médica");
        especialidade.setDescricao("Especialidade de teste");
        return especialidadeRepository.save(especialidade);
    }

    private TipoConsulta criarTipoConsulta() {
        TipoConsulta tipoConsulta = new TipoConsulta();
        tipoConsulta.setTipo("Primeira Consulta");
        return tipoConsultaRepository.save(tipoConsulta);
    }

    private LocalDate proximaSegunda() {
        return LocalDate.now().with(TemporalAdjusters.next(DayOfWeek.MONDAY));
    }
}
