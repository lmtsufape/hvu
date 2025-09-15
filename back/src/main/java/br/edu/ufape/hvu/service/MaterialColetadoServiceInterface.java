package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.MaterialColetado;

public interface MaterialColetadoServiceInterface {
	MaterialColetado saveMaterialColetado(MaterialColetado o);
	MaterialColetado findMaterialColetadoById(long id);
	MaterialColetado updateMaterialColetado(MaterialColetado u);
    void deleteMaterialColetado(long id);
	List<MaterialColetado> getAllMaterialColetado();
    
    

    
}