package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.OrgaoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Orgao;

@Service
@RequiredArgsConstructor
public class OrgaoService implements OrgaoServiceInterface {
	private final OrgaoRepository repository;

	public Orgao saveOrgao(Orgao newInstance) {
		return repository.save(newInstance);
	}

	public Orgao updateOrgao(Orgao transientObject) {
		return repository.save(transientObject);
	}

	public Orgao findOrgaoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Orgao"));
	}

	public List<Orgao> getAllOrgao(){
		return repository.findAll();
	}

	public void deleteOrgao(long id){
		Orgao obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Orgao"));
		repository.delete(obj);
	}
}