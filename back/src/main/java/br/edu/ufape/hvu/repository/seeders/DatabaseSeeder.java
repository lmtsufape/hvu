package br.edu.ufape.hvu.repository.seeders;


import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DatabaseSeeder {
    final private AgendamentoSeeder agendamentoSeeder;
    final private AnimalSeeder animalSeeder;
    final private EspecialidadeSeeder especialidadeSeeder;
    final private VagaSeeder vagaSeeder;
    private final UsuarioSeeder usuarioSeeder;
    private final InstituicaoSeeder instituicaoSeeder;
    private final MedicoSeeder medicoSeeder;
    private final TipoConsultaSeeder tipoConsultaSeeder;
    private final EspecieSeeder especieSeeder;
    private final RacaSeeder racaSeeder;
    private final AreaSeeder areaSeeder;
    private final ConsultaSeeder consultaSeeder;
    private final CronogramaSeeder cronogramaSeeder;
    private final EstagiarioSeeder estagiarioSeeder;
    private final TutorSeeder tutorSeeder;
    private final FotoSeeder fotoSeeder;
    private final OrgaoSeeder orgaoSeeder;
    private final FichaSeeder fichaSeeder;
    private final SecretarioSeeder secretarioSeeder;
    private final PatologistaSeeder patologistaSeeder;
    private final AdminLapaSeeder adminLapaSeeder;

    @Value("${common.seeders}")
    private boolean seeders;

    @PostConstruct
    public void init(){
        if (!seeders) {
            return;
        }
        usuarioSeeder.init();
        estagiarioSeeder.init();
        especialidadeSeeder.init();
        instituicaoSeeder.init();
        medicoSeeder.init();
        tipoConsultaSeeder.init();
        especieSeeder.init();
        racaSeeder.init();
        animalSeeder.init();
        tutorSeeder.init();
        agendamentoSeeder.init();
        vagaSeeder.init();
        areaSeeder.init();
        fichaSeeder.init();
        consultaSeeder.init();
        cronogramaSeeder.init();
        fotoSeeder.init();
        orgaoSeeder.init();
        secretarioSeeder.init();
        patologistaSeeder.init();
        adminLapaSeeder.init();

    }
}
