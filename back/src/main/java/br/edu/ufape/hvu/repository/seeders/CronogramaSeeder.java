package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.model.Vaga;
import br.edu.ufape.hvu.repository.CronogramaRepository;
import br.edu.ufape.hvu.repository.EspecialidadeRepository;
import br.edu.ufape.hvu.repository.MedicoRepository;
import br.edu.ufape.hvu.repository.VagaRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class CronogramaSeeder {
    final private CronogramaRepository cronogramaRepository;
    final private EspecialidadeRepository especialidadeRepository;
    final private MedicoRepository medicoRepository;
    final private VagaRepository vagaRepository;

    @PostConstruct
    public void init(){
        if(cronogramaRepository.count() > 0){
            return;
        }
        List<Especialidade> especialidades = especialidadeRepository.findAll();
        List<Medico> medicos = medicoRepository.findAll();
        List<Vaga> vagas = vagaRepository.findAll();
        Cronograma cronograma = new Cronograma();
        cronograma.setId(1);
        cronograma.setEspecialidade(especialidades.get(0));
        cronograma.setMedico(medicos.get(0));
        cronograma.setVaga(vagas);
        cronograma.setHorariosJson("{\"MONDAY\":{\"inicio\":\"08:00\",\"fim\":\"16:00\"},\"TUESDAY\":{\"inicio\":\"12:00\",\"fim\":\"17:00\"},\"WEDNESDAY\":{\"inicio\":\"12:00\",\"fim\":\"14:00\"},\"THURSDAY\":{\"inicio\":\"08:00\",\"fim\":\"10:00\"},\"FRIDAY\":{\"inicio\":\"08:00\",\"fim\":\"12:00\"}}");
        cronograma.setTempoAtendimento(60.0);
        cronogramaRepository.save(cronograma);
    }
}
