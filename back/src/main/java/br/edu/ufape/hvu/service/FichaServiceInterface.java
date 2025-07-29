package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Ficha;

import java.util.List;

public interface FichaServiceInterface {
    Ficha saveFicha(Ficha o);
    Ficha findFichaById(long id);
    List<Ficha> findFichasByAgendamentoId(long agendamentoId);
    List<Ficha> findFichasByAnimalId(long animalId);
    Ficha updateFicha(Ficha u);
    void deleteFicha(long id);
    List<Ficha> getAllFicha();
}