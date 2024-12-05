package br.edu.ufape.hvu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FichaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Ficha;


@Service
public class FichaService implements FichaServiceInterface {
    @Autowired
    private FichaRepository repository;

    public Ficha saveFicha(Ficha newInstance) {
        return repository.save(newInstance);
    }

    public Ficha updateFicha(Ficha transientObject) {
        return repository.save(transientObject);
    }

    public Ficha findFichaById(long id) {
        return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Ficha"));
    }

    public List<Ficha> getAllFicha(){
        return repository.findAll();
    }

    public void deleteFicha(Ficha persistentObject){
        this.deleteFicha(persistentObject.getId());
    }

    public void deleteFicha(long id){
        Ficha obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Ficha"));
        repository.delete(obj);
    }

}
