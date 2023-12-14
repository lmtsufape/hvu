package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FichaSolicitacaoServicoRepository;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;

@Service
public class FichaSolicitacaoServicoService implements FichaSolicitacaoServicoServiceInterface {
	@Autowired
	private FichaSolicitacaoServicoRepository repository;


	public FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico newInstance) {
		return repository.save(newInstance);
	}

	public FichaSolicitacaoServico updateFichaSolicitacaoServico(FichaSolicitacaoServico transientObject) {
		return repository.save(transientObject);
	}

	public FichaSolicitacaoServico findFichaSolicitacaoServicoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist FichaSolicitacaoServico with id = " + id));
	}

	public List<FichaSolicitacaoServico> getAllFichaSolicitacaoServico(){
		return repository.findAll();
	}

	public void deleteFichaSolicitacaoServico(FichaSolicitacaoServico persistentObject){
		this.deleteFichaSolicitacaoServico(persistentObject.getId());
		
	}
	
	public void deleteFichaSolicitacaoServico(long id){
		FichaSolicitacaoServico obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist FichaSolicitacaoServico with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}