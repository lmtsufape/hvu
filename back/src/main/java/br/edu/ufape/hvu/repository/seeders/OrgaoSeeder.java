package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Orgao;
import br.edu.ufape.hvu.repository.AreaRepository;
import br.edu.ufape.hvu.repository.FotoRepository;
import br.edu.ufape.hvu.repository.OrgaoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component @RequiredArgsConstructor
public class OrgaoSeeder {
    final private OrgaoRepository orgaoRepository;
    final private FotoRepository fotoRepository;
    final private AreaRepository areaRepository;

    @PostConstruct
    public void init(){
        if(orgaoRepository.count() > 0){
            return;
        }
        orgaoRepository.saveAll(
            List.of(
                new Orgao(1, "foto do coração", "Coração", true, true, fotoRepository.findById(1L).get(), Collections.singletonList(areaRepository.findById(1L).get())),
                new Orgao(2, "foto do fígado", "Fígado", true, true, fotoRepository.findById(1L).get(), Collections.singletonList(areaRepository.findById(1L).get()))
            )
        );
    }
}
