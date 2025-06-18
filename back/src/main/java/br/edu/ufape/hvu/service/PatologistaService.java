package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.PatologistaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Patologista;

@Service
@RequiredArgsConstructor
public class PatologistaService implements PatologistaServiceInterface {
    private final PatologistaRepository repository;

    public Patologista savePatologista(Patologista newInstance) {
        return repository.save(newInstance);
    }

    public Patologista updatePatologista(Patologista transientObject) {
        return repository.save(transientObject);
    }

    public Patologista findPatologistaById(long id) {
        return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Patologista"));
    }

    public List<Patologista> getAllPatologista(){
        return repository.findAll();
    }

    public void deletePatologista(long id){
        Patologista obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Patologista"));
        repository.delete(obj);
    }
}