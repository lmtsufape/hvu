package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.TipoConsulta;
import br.edu.ufape.hvu.repository.TipoConsultaRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class TipoConsultaSeeder {
    final private TipoConsultaRepository tipoConsultaRepository;


    public void init(){
        if(tipoConsultaRepository.count() > 0){
            return;
        }
        TipoConsulta tipoConsulta = new TipoConsulta();
        TipoConsulta tipoConsulta2 = new TipoConsulta();
        tipoConsulta.setId(1);
        tipoConsulta.setTipo("Primeira Consulta");
        tipoConsulta2.setId(2);
        tipoConsulta2.setTipo("Retorno");
        tipoConsultaRepository.save(tipoConsulta);
        tipoConsultaRepository.save(tipoConsulta2);





    }
}
