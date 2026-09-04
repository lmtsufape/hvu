package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.TipoConsulta;
import br.edu.ufape.hvu.repository.TipoConsultaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class TipoConsultaSeeder {
    private final TipoConsultaRepository tipoConsultaRepository;

    public void init(){
        if(tipoConsultaRepository.count() > 0){
            return;
        }
        TipoConsulta tipoConsulta = new TipoConsulta();
        TipoConsulta tipoConsulta2 = new TipoConsulta();
        tipoConsulta.setTipo("Primeira Consulta");
        tipoConsulta2.setTipo("Retorno");
        tipoConsultaRepository.save(tipoConsulta);
        tipoConsultaRepository.save(tipoConsulta2);
    }
}
