package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Ficha;

import java.util.List;

public interface FichaServiceInterface {
    Ficha saveFicha(Ficha o);
    Ficha findFichaById(long id);
    Ficha updateFicha(Ficha u);
    void deleteFicha(long id);
    List<Ficha> getAllFicha();
}