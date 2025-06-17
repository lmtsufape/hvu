package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.CampoLaudoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.CampoLaudo;

@Service
@RequiredArgsConstructor
public class CampoLaudoService implements CampoLaudoServiceInterface {
	private final CampoLaudoRepository repository;


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

	public void deleteCampoLaudo(long id){
		CampoLaudo obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "CampoLaudo"));
		repository.delete(obj);
	}	
	
	
	
}