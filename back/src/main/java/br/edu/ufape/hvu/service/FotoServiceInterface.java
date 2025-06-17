package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Foto;

public interface FotoServiceInterface {
	Foto saveFoto(Foto o);
	Foto findFotoById(long id);
	Foto updateFoto(Foto u);
    void deleteFoto(long id);
	List<Foto> getAllFoto();
    
    

    
}