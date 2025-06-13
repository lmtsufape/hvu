package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.TipoConsulta;

public interface TipoConsultaServiceInterface {
	TipoConsulta saveTipoConsulta(TipoConsulta o);
	TipoConsulta findTipoConsultaById(long id);
	TipoConsulta updateTipoConsulta(TipoConsulta u);
	void deleteTipoConsulta(long id);
	List<TipoConsulta> getAllTipoConsulta();
    
}