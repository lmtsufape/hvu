package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AvaliacaoFisicoEspecialRepository;
import br.edu.ufape.hvu.model.AvaliacaoFisicoEspecial;

@Service
public class AvaliacaoFisicoEspecialService implements AvaliacaoFisicoEspecialServiceInterface {
	@Autowired
	private AvaliacaoFisicoEspecialRepository repository;


	public AvaliacaoFisicoEspecial saveAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial newInstance) {
		return repository.save(newInstance);
	}

	public AvaliacaoFisicoEspecial updateAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial transientObject) {
		return repository.save(transientObject);
	}

	public AvaliacaoFisicoEspecial findAvaliacaoFisicoEspecialById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist AvaliacaoFisicoEspecial with id = " + id));
	}

	public List<AvaliacaoFisicoEspecial> getAllAvaliacaoFisicoEspecial(){
		return repository.findAll();
	}

	public void deleteAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial persistentObject){
		this.deleteAvaliacaoFisicoEspecial(persistentObject.getId());
		
	}
	
	public void deleteAvaliacaoFisicoEspecial(long id){
		AvaliacaoFisicoEspecial obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist AvaliacaoFisicoEspecial with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}