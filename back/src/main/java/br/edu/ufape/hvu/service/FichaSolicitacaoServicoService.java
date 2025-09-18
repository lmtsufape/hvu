package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.FichaSolicitacaoServicoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.FichaSolicitacaoServico;

@Service
@RequiredArgsConstructor
public class FichaSolicitacaoServicoService implements FichaSolicitacaoServicoServiceInterface {
	private final FichaSolicitacaoServicoRepository repository;

	public FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico newInstance) {
		return repository.save(newInstance);
	}

	public FichaSolicitacaoServico updateFichaSolicitacaoServico(FichaSolicitacaoServico transientObject) {
		return repository.save(transientObject);
	}

	public FichaSolicitacaoServico findFichaSolicitacaoServicoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id,"FichaSolicitacaoServico"));
	}

	public List<FichaSolicitacaoServico> getAllFichaSolicitacaoServico(){
		return repository.findAll();
	}

	public void deleteFichaSolicitacaoServico(long id){
		FichaSolicitacaoServico obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id,"FichaSolicitacaoServico"));
		repository.delete(obj);
	}
}