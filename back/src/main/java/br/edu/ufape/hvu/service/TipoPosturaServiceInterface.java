package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoPostura;

public interface TipoPosturaServiceInterface {
	TipoPostura saveTipoPostura(TipoPostura o);
	TipoPostura findTipoPosturaById(long id);
	TipoPostura updateTipoPostura(TipoPostura u);
	void deleteTipoPostura(TipoPostura u);
	void deleteTipoPostura(long id);
	List<TipoPostura> getAllTipoPostura();
    
    

    
}