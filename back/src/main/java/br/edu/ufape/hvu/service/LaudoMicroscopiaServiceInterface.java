package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.LaudoMicroscopia;

public interface LaudoMicroscopiaServiceInterface {
	LaudoMicroscopia saveLaudoMicroscopia(LaudoMicroscopia o);
	LaudoMicroscopia findLaudoMicroscopiaById(long id);
	LaudoMicroscopia updateLaudoMicroscopia(LaudoMicroscopia u);
	void deleteLaudoMicroscopia(LaudoMicroscopia u);
	void deleteLaudoMicroscopia(long id);
	List<LaudoMicroscopia> getAllLaudoMicroscopia();
    
    

    
}