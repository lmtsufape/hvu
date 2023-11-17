package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoMucosa;

public interface TipoMucosaServiceInterface {
	TipoMucosa saveTipoMucosa(TipoMucosa o);
	TipoMucosa findTipoMucosaById(long id);
	TipoMucosa updateTipoMucosa(TipoMucosa u);
	void deleteTipoMucosa(TipoMucosa u);
	void deleteTipoMucosa(long id);
	List<TipoMucosa> getAllTipoMucosa();
    
    

    
}