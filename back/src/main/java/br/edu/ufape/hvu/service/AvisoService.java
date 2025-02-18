package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AvisoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Aviso;

@Service
public class AvisoService implements AvisoServiceInterface {
    @Autowired
    private AvisoRepository repository;

    public Aviso saveAviso(Aviso newInstance) {
        return repository.save(newInstance);
    }

    public Aviso updateAviso(Aviso transientObject) {
        return repository.save(transientObject);
    }

    public Aviso findAvisoById(long id) {
        return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Aviso"));
    }

    public List<Aviso> getAllAviso(){
        return repository.findAll();
    }

    public void deleteAviso(Aviso persistentObject){
        this.deleteAviso(persistentObject.getId());
    }

    public void deleteAviso(long id){
        Aviso obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Aviso"));
        repository.delete(obj);
    }

}
