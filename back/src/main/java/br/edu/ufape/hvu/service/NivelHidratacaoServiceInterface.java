package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.NivelHidratacao;

public interface NivelHidratacaoServiceInterface {
	NivelHidratacao saveNivelHidratacao(NivelHidratacao o);
	NivelHidratacao findNivelHidratacaoById(long id);
	NivelHidratacao updateNivelHidratacao(NivelHidratacao u);
	void deleteNivelHidratacao(NivelHidratacao u);
	void deleteNivelHidratacao(long id);
	List<NivelHidratacao> getAllNivelHidratacao();
    
    

    
}