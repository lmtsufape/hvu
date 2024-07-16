package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.repository.*;
import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component @RequiredArgsConstructor
public class VagaSeeder {
    final private VagaRepository vagaRepository;
    final private TipoConsultaRepository tipoConsultaRepository;
    final private MedicoRepository medicoRepository;
    final private EspecialidadeRepository especialidadeRepository;
    final private AgendamentoRepository agendamentoRepository;


    public void init(){
        if(vagaRepository.count() > 0){
            return;
        }
        Faker faker = new Faker();
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


