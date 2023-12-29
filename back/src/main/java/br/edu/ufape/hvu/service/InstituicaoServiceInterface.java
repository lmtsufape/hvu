package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Instituicao;

public interface InstituicaoServiceInterface {
	Instituicao saveInstituicao(Instituicao o);
	Instituicao findInstituicaoById(long id);
	Instituicao updateInstituicao(Instituicao u);
	void deleteInstituicao(Instituicao u);
	void deleteInstituicao(long id);
	List<Instituicao> getAllInstituicao();
    
    

    
}