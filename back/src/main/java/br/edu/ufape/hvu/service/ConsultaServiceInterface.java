package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Consulta;

public interface ConsultaServiceInterface {
	Consulta saveConsulta(Consulta o);
	Consulta findConsultaById(long id);
	Consulta updateConsulta(Consulta u);
	void deleteConsulta(long id);
	List<Consulta> getAllConsulta();
    List<Consulta> getConsultasByAnimalFichaNumero(String animalFichaNumero);
	List<Consulta> getConsultasByAnimalId(Long id);

    
}