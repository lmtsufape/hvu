package br.edu.ufape.hvu.repository.seeders;


import br.edu.ufape.hvu.model.Medicamento;
import br.edu.ufape.hvu.repository.MedicamentoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component @RequiredArgsConstructor
public class MedicamentoSeeder {
    final private MedicamentoRepository medicamentoRepository;


    public void init(){
        if(medicamentoRepository.count() > 0){
            return;
        }

        medicamentoRepository.saveAll(
                List.of(
                        new Medicamento(1, "Recojojina", "Recojojina é um medicamento para dor de dente"),
                        new Medicamento(2, "Dorflex", "Dorflex é um medicamento para dor de cabeça")
                )
        );

    }
}
