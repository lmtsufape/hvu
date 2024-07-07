package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Foto;
import br.edu.ufape.hvu.repository.FotoRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class FotoSeeder {
    final private FotoRepository fotoRepository;

    @PostConstruct
    public void init(){
        if(fotoRepository.count() > 0){
            return;
        }
        fotoRepository.save(new Foto(1, "Coracao", "1720372624011-coracao.webp"));

    }
}
