package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.MedicacaoPeriodicaRepository;
import br.edu.ufape.hvu.model.MedicacaoPeriodica;

@Service
public class MedicacaoPeriodicaService implements MedicacaoPeriodicaServiceInterface {
	@Autowired
	private MedicacaoPeriodicaRepository repository;


	public MedicacaoPeriodica saveMedicacaoPeriodica(MedicacaoPeriodica newInstance) {
		return repository.save(newInstance);
	}

	public MedicacaoPeriodica updateMedicacaoPeriodica(MedicacaoPeriodica transientObject) {
		return repository.save(transientObject);
	}

	public MedicacaoPeriodica findMedicacaoPeriodicaById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist MedicacaoPeriodica with id = " + id));
	}

	public List<MedicacaoPeriodica> getAllMedicacaoPeriodica(){
		return repository.findAll();
	}

	public void deleteMedicacaoPeriodica(MedicacaoPeriodica persistentObject){
		this.deleteMedicacaoPeriodica(persistentObject.getId());
		
	}
	
	public void deleteMedicacaoPeriodica(long id){
		MedicacaoPeriodica obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist MedicacaoPeriodica with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}