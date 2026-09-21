package br.edu.ufape.hvu;

import br.edu.ufape.hvu.controller.dto.request.AnimalRequest;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.ContadorProntuario;
import br.edu.ufape.hvu.model.Ficha;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.repository.ContadorProntuarioRepository;
import br.edu.ufape.hvu.repository.FichaRepository;
import br.edu.ufape.hvu.service.CodigoProntuarioService;
import br.edu.ufape.hvu.service.KeycloakService;
import br.edu.ufape.hvu.service.MedicoServiceInterface;
import br.edu.ufape.hvu.service.TutorServiceInterface;
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

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ActiveProfiles("test")
@Testcontainers
@SpringBootTest
class CodigoProntuarioIntegrationTest {

    private static final String SESSION = "medico-user-id";

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
    private CodigoProntuarioService codigoProntuarioService;

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private ContadorProntuarioRepository contadorProntuarioRepository;

    @Autowired
    private FichaRepository fichaRepository;

    @MockitoBean
    private KeycloakService keycloakService;

    @MockitoBean
    private TutorServiceInterface tutorServiceInterface;

    @MockitoBean
    private MedicoServiceInterface medicoServiceInterface;

    @BeforeEach
    void configurar() {
        fichaRepository.deleteAll();
        animalRepository.deleteAll();
        contadorProntuarioRepository.deleteAll();
        contadorProntuarioRepository.save(new ContadorProntuario());
        codigoProntuarioService.definirValorInicial(1);

        lenient().when(keycloakService.hasRolePatologista(SESSION)).thenReturn(true);
        lenient().when(keycloakService.hasRoleMedico(SESSION)).thenReturn(false);
        lenient().when(keycloakService.hasRoleTutor(SESSION)).thenReturn(false);
        lenient().when(medicoServiceInterface.findByUserId(SESSION)).thenReturn(null);
    }

    @Test
    void criarFichaSemAlterarTipo_geraProntuarioComum() {
        Animal animal = criarAnimal(TipoAnimal.COMUM);

        criarFicha(animal);

        Animal atualizado = buscarAnimal(animal.getId());
        assertEquals("001", atualizado.getCodigoProntuario());
        assertEquals(TipoAnimal.COMUM, atualizado.getTipo());
    }

    @Test
    void alterarTipoParaSilvestre_DepoisCriarFicha_mantemProntuarioConsistente() {
        Animal animal = criarAnimal(TipoAnimal.COMUM);
        criarFicha(animal);

        alterarTipo(animal.getId(), TipoAnimal.SILVESTRE);

        Animal atualizado = buscarAnimal(animal.getId());
        assertEquals(TipoAnimal.SILVESTRE, atualizado.getTipo());
        assertEquals("001SIL", atualizado.getCodigoProntuario());

        criarFicha(atualizado);

        assertEquals("001SIL", buscarAnimal(animal.getId()).getCodigoProntuario());
    }

    @Test
    void alterarTipoMaisDeUmaVez_DepoisCriarFicha_mantemProntuarioConsistente() {
        Animal animal = criarAnimal(TipoAnimal.COMUM);
        criarFicha(animal);

        alterarTipo(animal.getId(), TipoAnimal.SILVESTRE);
        assertEquals("001SIL", buscarAnimal(animal.getId()).getCodigoProntuario());

        alterarTipo(animal.getId(), TipoAnimal.COMUM);
        assertEquals("001", buscarAnimal(animal.getId()).getCodigoProntuario());

        criarFicha(buscarAnimal(animal.getId()));

        assertEquals("001", buscarAnimal(animal.getId()).getCodigoProntuario());
    }

    @Test
    void alterarTipoSemFichaPrevia_naoQuebraEGeraProntuarioNaPrimeiraFicha() {
        Animal animal = criarAnimal(TipoAnimal.SILVESTRE);

        alterarTipo(animal.getId(), TipoAnimal.COMUM);

        Animal atualizado = buscarAnimal(animal.getId());
        assertEquals(TipoAnimal.COMUM, atualizado.getTipo());

        criarFicha(atualizado);

        assertEquals("001", buscarAnimal(animal.getId()).getCodigoProntuario());
    }

    private Animal criarAnimal(TipoAnimal tipo) {
        Animal animal = new Animal();
        animal.setNome("Paciente Teste");
        animal.setSexo("Macho");
        animal.setPeso(10.0);
        animal.setTipo(tipo);
        animal.setOrigemAnimal(OrigemAnimal.HVU);
        return animalRepository.save(animal);
    }

    private Animal buscarAnimal(long id) {
        return animalRepository.findById(id).orElseThrow();
    }

    private void alterarTipo(long animalId, TipoAnimal novoTipo) {
        AnimalRequest request = new AnimalRequest();
        request.setTipo(novoTipo);

        facade.updateAnimal(animalId, request, SESSION);
    }

    private Ficha criarFicha(Animal animal) {
        Ficha ficha = new Ficha();
        ficha.setNome("Ficha Clínica Médica");
        ficha.setConteudo("{}");
        ficha.setDataHora(LocalDateTime.now());

        Animal referenciaAnimal = new Animal();
        referenciaAnimal.setId(animal.getId());
        ficha.setAnimal(referenciaAnimal);

        return facade.saveFicha(ficha, SESSION);
    }
}
