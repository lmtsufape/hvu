package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.ScoreCorporal;

public interface ScoreCorporalServiceInterface {
	ScoreCorporal saveScoreCorporal(ScoreCorporal o);
	ScoreCorporal findScoreCorporalById(long id);
	ScoreCorporal updateScoreCorporal(ScoreCorporal u);
	void deleteScoreCorporal(ScoreCorporal u);
	void deleteScoreCorporal(long id);
	List<ScoreCorporal> getAllScoreCorporal();
    
    

    
}