package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AvaliacaoFisicoGeralRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.AvaliacaoFisicoGeral;

@Service
public class AvaliacaoFisicoGeralService implements AvaliacaoFisicoGeralServiceInterface {
	@Autowired
	private AvaliacaoFisicoGeralRepository repository;


	public AvaliacaoFisicoGeral saveAvaliacaoFisicoGeral(AvaliacaoFisicoGeral newInstance) {
		return repository.save(newInstance);
	}

	public AvaliacaoFisicoGeral updateAvaliacaoFisicoGeral(AvaliacaoFisicoGeral transientObject) {
		return repository.save(transientObject);
	}

	public AvaliacaoFisicoGeral findAvaliacaoFisicoGeralById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "AvaliacaoFisicoGeral"));
	}

	public List<AvaliacaoFisicoGeral> getAllAvaliacaoFisicoGeral(){
		return repository.findAll();
	}

	public void deleteAvaliacaoFisicoGeral(AvaliacaoFisicoGeral persistentObject){
		this.deleteAvaliacaoFisicoGeral(persistentObject.getId());
		
	}
	
	public void deleteAvaliacaoFisicoGeral(long id){
		AvaliacaoFisicoGeral obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist AvaliacaoFisicoGeral with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}