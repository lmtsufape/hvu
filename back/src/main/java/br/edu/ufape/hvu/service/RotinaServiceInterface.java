package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Rotina;

public interface RotinaServiceInterface {
	Rotina saveRotina(Rotina o);
	Rotina findRotinaById(long id);
	Rotina updateRotina(Rotina u);
	void deleteRotina(Rotina u);
	void deleteRotina(long id);
	List<Rotina> getAllRotina();
    
    

    
}