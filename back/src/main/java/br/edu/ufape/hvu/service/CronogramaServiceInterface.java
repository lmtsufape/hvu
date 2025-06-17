package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Cronograma;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Medico;

public interface CronogramaServiceInterface {
	Cronograma saveCronograma(Cronograma o);
	Cronograma findCronogramaById(long id);
	Cronograma updateCronograma(Cronograma u);
	void deleteCronograma(long id);
	List<Cronograma> getAllCronograma();
	List<Cronograma> findCronogramaByMedico(Medico medico);
	List<Cronograma> findCronogramaByEspecialidade(Especialidade especialidade);
    
    

    
}