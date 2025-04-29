package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Ficha;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface FichaServiceInterface {
    Ficha saveFicha(Ficha o);
    Ficha findFichaById(long id);
    Ficha updateFicha(Ficha u);
    void deleteFicha(Ficha u);
    void deleteFicha(long id);
    List<Ficha> getAllFicha();
}