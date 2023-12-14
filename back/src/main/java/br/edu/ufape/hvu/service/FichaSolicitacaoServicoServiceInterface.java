package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.FichaSolicitacaoServico;

public interface FichaSolicitacaoServicoServiceInterface {
	FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico o);
	FichaSolicitacaoServico findFichaSolicitacaoServicoById(long id);
	FichaSolicitacaoServico updateFichaSolicitacaoServico(FichaSolicitacaoServico u);
	void deleteFichaSolicitacaoServico(FichaSolicitacaoServico u);
	void deleteFichaSolicitacaoServico(long id);
	List<FichaSolicitacaoServico> getAllFichaSolicitacaoServico();
    
    

    
}