package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Orgao;

public interface OrgaoServiceInterface {
	Orgao saveOrgao(Orgao o);
	Orgao findOrgaoById(long id);
	Orgao updateOrgao(Orgao u);
	void deleteOrgao(Orgao u);
	void deleteOrgao(long id);
	List<Orgao> getAllOrgao();
    
    

    
}