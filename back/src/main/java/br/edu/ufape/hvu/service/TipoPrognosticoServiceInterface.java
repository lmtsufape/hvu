package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoPrognostico;

public interface TipoPrognosticoServiceInterface {
	TipoPrognostico saveTipoPrognostico(TipoPrognostico o);
	TipoPrognostico findTipoPrognosticoById(long id);
	TipoPrognostico updateTipoPrognostico(TipoPrognostico u);
	void deleteTipoPrognostico(TipoPrognostico u);
	void deleteTipoPrognostico(long id);
	List<TipoPrognostico> getAllTipoPrognostico();
    
    

    
}