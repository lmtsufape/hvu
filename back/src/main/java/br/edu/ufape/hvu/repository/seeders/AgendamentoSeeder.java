package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.repository.AnimalRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component @RequiredArgsConstructor
public class AgendamentoSeeder {
    final private AgendamentoRepository agendamentoRepository;
    final private AnimalRepository animalRepository;

    public void init(){
        if(agendamentoRepository.count() > 0){
            return;
        }
        List<Animal> animais = animalRepository.findAll();
        Agendamento agendamento = new Agendamento();
        agendamento.setAnimal(animais.get(0));
        agendamento.setDataVaga(LocalDateTime.parse("2022-10-10T10:00:00"));
        agendamento.setStatus("Aguardando");
        agendamento.setTipoEspecial(false);
        agendamentoRepository.save(agendamento);
    }
}
