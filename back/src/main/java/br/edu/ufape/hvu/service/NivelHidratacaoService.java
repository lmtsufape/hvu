package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.NivelHidratacaoRepository;
import br.edu.ufape.hvu.model.NivelHidratacao;

@Service
public class NivelHidratacaoService implements NivelHidratacaoServiceInterface {
	@Autowired
	private NivelHidratacaoRepository repository;


	public NivelHidratacao saveNivelHidratacao(NivelHidratacao newInstance) {
		return repository.save(newInstance);
	}

	public NivelHidratacao updateNivelHidratacao(NivelHidratacao transientObject) {
		return repository.save(transientObject);
	}

	public NivelHidratacao findNivelHidratacaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist NivelHidratacao with id = " + id));
	}

	public List<NivelHidratacao> getAllNivelHidratacao(){
		return repository.findAll();
	}

	public void deleteNivelHidratacao(NivelHidratacao persistentObject){
		this.deleteNivelHidratacao(persistentObject.getId());
		
	}
	
	public void deleteNivelHidratacao(long id){
		NivelHidratacao obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist NivelHidratacao with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}