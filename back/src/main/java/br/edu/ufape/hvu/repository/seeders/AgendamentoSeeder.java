package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.enums.StatusAgendamentoEVaga;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.repository.AnimalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component @RequiredArgsConstructor
public class AgendamentoSeeder {
    private final AgendamentoRepository agendamentoRepository;
    private final AnimalRepository animalRepository;

    public void init(){
        if(agendamentoRepository.count() > 0){
            return;
        }
        List<Animal> animais = animalRepository.findAll();
        Agendamento agendamento = new Agendamento();
        agendamento.setAnimal(animais.get(0));
        agendamento.setDataVaga(LocalDateTime.parse("2025-09-10T10:30:00"));
        agendamento.setStatus(String.valueOf(StatusAgendamentoEVaga.Agendado));
        agendamento.setTipoEspecial(false);
        agendamentoRepository.save(agendamento);
    }
    
}
