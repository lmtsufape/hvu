package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.CampoLaudo;

public interface CampoLaudoServiceInterface {
	CampoLaudo saveCampoLaudo(CampoLaudo o);
	CampoLaudo findCampoLaudoById(long id);
	CampoLaudo updateCampoLaudo(CampoLaudo u);
	void deleteCampoLaudo(CampoLaudo u);
	void deleteCampoLaudo(long id);
	List<CampoLaudo> getAllCampoLaudo();
    
    

    
}