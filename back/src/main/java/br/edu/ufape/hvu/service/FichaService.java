package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.exception.InvalidJsonException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FichaRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Ficha;

@Service
@RequiredArgsConstructor
public class FichaService implements FichaServiceInterface {
    private final FichaRepository repository;

    public Ficha saveFicha(Ficha newInstance) {
        validarJson(newInstance.getConteudo());
        return repository.save(newInstance);
    }

    public Ficha updateFicha(Ficha transientObject) {
        validarJson(transientObject.getConteudo());
        return repository.save(transientObject);
    }

    public Ficha findFichaById(long id) {
        return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Ficha"));
    }

    public List<Ficha> getAllFicha(){
        return repository.findAll();
    }

    public void deleteFicha(long id){
        Ficha obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Ficha"));
        repository.delete(obj);
    }

    private void validarJson(String json) {
        if (json == null || json.isBlank()) {
            throw new InvalidJsonException("O campo 'conteudo' está vazio.");
        }

        try {
            new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            throw new InvalidJsonException("Conteúdo JSON inválido: " + e.getOriginalMessage(), e);
        }
    }

}