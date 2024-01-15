package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.CampoLaudoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.CampoLaudo;

@Service
public class CampoLaudoService implements CampoLaudoServiceInterface {
	@Autowired
	private CampoLaudoRepository repository;


	public CampoLaudo saveCampoLaudo(CampoLaudo newInstance) {
		return repository.save(newInstance);
	}

	public CampoLaudo updateCampoLaudo(CampoLaudo transientObject) {
		return repository.save(transientObject);
	}

	public CampoLaudo findCampoLaudoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "CampoLaudo"));
	}

	public List<CampoLaudo> getAllCampoLaudo(){
		return repository.findAll();
	}

	public void deleteCampoLaudo(CampoLaudo persistentObject){
		this.deleteCampoLaudo(persistentObject.getId());
		
	}
	
	public void deleteCampoLaudo(long id){
		CampoLaudo obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "CampoLaudo"));
		repository.delete(obj);
	}	
	
	
	
}