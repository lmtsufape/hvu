package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoLinfonodos;

public interface TipoLinfonodosServiceInterface {
	TipoLinfonodos saveTipoLinfonodos(TipoLinfonodos o);
	TipoLinfonodos findTipoLinfonodosById(long id);
	TipoLinfonodos updateTipoLinfonodos(TipoLinfonodos u);
	void deleteTipoLinfonodos(TipoLinfonodos u);
	void deleteTipoLinfonodos(long id);
	List<TipoLinfonodos> getAllTipoLinfonodos();
    
    

    
}