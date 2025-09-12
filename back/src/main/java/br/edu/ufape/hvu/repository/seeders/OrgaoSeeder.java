package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Orgao;
import br.edu.ufape.hvu.repository.AreaRepository;
import br.edu.ufape.hvu.repository.OrgaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Collections;
import java.util.List;

@Component @RequiredArgsConstructor
public class OrgaoSeeder {
    private final OrgaoRepository orgaoRepository;
    private final AreaRepository areaRepository;

    public void init(){
        if(orgaoRepository.count() > 0){
            return;
        }
        orgaoRepository.saveAll(
            List.of(
                new Orgao(1, "Coração", true, true, Collections.singletonList(areaRepository.findById(1L).get()),
                        null),
                new Orgao(2,"Fígado", true, true,  Collections.singletonList(areaRepository.findById(1L).get()),
                        null)
            )
        );
    }
}
