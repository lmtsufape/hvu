package br.edu.ufape.hvu.repository.seeders;


import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class DatabaseSeeder {
    final private AgendamentoSeeder agendamentoSeeder;
    final private AnimalSeeder animalSeeder;
    final private EspecialidadeSeeder especialidadeSeeder;
    final private MedicamentoSeeder medicamentoSeeder;
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
    private final DiretorSeeder diretorSeeder;
    private final FotoSeeder fotoSeeder;
    private final OrgaoSeeder orgaoSeeder;

    @PostConstruct
    public void init(){
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
        diretorSeeder.init();
        agendamentoSeeder.init();
        vagaSeeder.init();
        medicamentoSeeder.init();
        areaSeeder.init();
        consultaSeeder.init();
        cronogramaSeeder.init();
        fotoSeeder.init();
        orgaoSeeder.init();
    }
}
