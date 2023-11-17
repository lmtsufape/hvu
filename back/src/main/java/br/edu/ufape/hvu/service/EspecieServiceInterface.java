package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Especie;

public interface EspecieServiceInterface {
	Especie saveEspecie(Especie o);
	Especie findEspecieById(long id);
	Especie updateEspecie(Especie u);
	void deleteEspecie(Especie u);
	void deleteEspecie(long id);
	List<Especie> getAllEspecie();
    
    

    
}