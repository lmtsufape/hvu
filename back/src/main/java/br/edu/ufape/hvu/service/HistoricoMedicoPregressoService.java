package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.HistoricoMedicoPregressoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.HistoricoMedicoPregresso;

@Service
public class HistoricoMedicoPregressoService implements HistoricoMedicoPregressoServiceInterface {
	@Autowired
	private HistoricoMedicoPregressoRepository repository;


	public HistoricoMedicoPregresso saveHistoricoMedicoPregresso(HistoricoMedicoPregresso newInstance) {
		return repository.save(newInstance);
	}

	public HistoricoMedicoPregresso updateHistoricoMedicoPregresso(HistoricoMedicoPregresso transientObject) {
		return repository.save(transientObject);
	}

	public HistoricoMedicoPregresso findHistoricoMedicoPregressoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "HistoricoMedicoPregresso"));
	}

	public List<HistoricoMedicoPregresso> getAllHistoricoMedicoPregresso(){
		return repository.findAll();
	}

	public void deleteHistoricoMedicoPregresso(HistoricoMedicoPregresso persistentObject){
		this.deleteHistoricoMedicoPregresso(persistentObject.getId());
		
	}
	
	public void deleteHistoricoMedicoPregresso(long id){
		HistoricoMedicoPregresso obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist HistoricoMedicoPregresso with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}