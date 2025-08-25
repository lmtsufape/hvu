package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component @RequiredArgsConstructor
public class VagaSeeder {
    private final VagaRepository vagaRepository;
    private final TipoConsultaRepository tipoConsultaRepository;
    private final MedicoRepository medicoRepository;
    private final EspecialidadeRepository especialidadeRepository;
    private final AgendamentoRepository agendamentoRepository;

    public void init(){
        if(vagaRepository.count() > 0){
            return;
        }
        List<TipoConsulta> tipoConsultas = tipoConsultaRepository.findAll();
        List<Medico> medicos = medicoRepository.findAll();
        List<Especialidade> especialidades = especialidadeRepository.findAll();
        List<Agendamento> agendamentos = agendamentoRepository.findAll();

        Vaga vaga = new Vaga();
        vaga.setDataHora(LocalDateTime.now());
        vaga.setMedico(medicos.get(0));
        vaga.setAgendamento(agendamentos.get(0));
        vaga.setEspecialidade(especialidades.get(0));
        vaga.setTipoConsulta(tipoConsultas.get(0));
        vaga.setStatus("Disponível");

        vagaRepository.save(vaga);

    }
}


