package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.PrescricaoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Prescricao;

@Service
public class PrescricaoService implements PrescricaoServiceInterface {
	@Autowired
	private PrescricaoRepository repository;


	public Prescricao savePrescricao(Prescricao newInstance) {
		return repository.save(newInstance);
	}

	public Prescricao updatePrescricao(Prescricao transientObject) {
		return repository.save(transientObject);
	}

	public Prescricao findPrescricaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Prescricao"));
	}

	public List<Prescricao> getAllPrescricao(){
		return repository.findAll();
	}

	public void deletePrescricao(Prescricao persistentObject){
		this.deletePrescricao(persistentObject.getId());
		
	}
	
	public void deletePrescricao(long id){
		Prescricao obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Prescricao"));
		repository.delete(obj);
	}	
	
	
	
}