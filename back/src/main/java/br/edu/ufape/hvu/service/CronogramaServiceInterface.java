package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Cronograma;

public interface CronogramaServiceInterface {
	Cronograma saveCronograma(Cronograma o);
	Cronograma findCronogramaById(long id);
	Cronograma updateCronograma(Cronograma u);
	void deleteCronograma(Cronograma u);
	void deleteCronograma(long id);
	List<Cronograma> getAllCronograma();
    
    

    
}