package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoTurgorCutaneo;

public interface TipoTurgorCutaneoServiceInterface {
	TipoTurgorCutaneo saveTipoTurgorCutaneo(TipoTurgorCutaneo o);
	TipoTurgorCutaneo findTipoTurgorCutaneoById(long id);
	TipoTurgorCutaneo updateTipoTurgorCutaneo(TipoTurgorCutaneo u);
	void deleteTipoTurgorCutaneo(TipoTurgorCutaneo u);
	void deleteTipoTurgorCutaneo(long id);
	List<TipoTurgorCutaneo> getAllTipoTurgorCutaneo();
    
    

    
}