package br.edu.ufape.hvu.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.MaterialColetadoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.MaterialColetado;

@Service
@RequiredArgsConstructor
public class MaterialColetadoService implements MaterialColetadoServiceInterface {
	private final MaterialColetadoRepository repository;


	public MaterialColetado saveMaterialColetado(MaterialColetado newInstance) {
		return repository.save(newInstance);
	}

	public MaterialColetado updateMaterialColetado(MaterialColetado transientObject) {
		return repository.save(transientObject);
	}

	public MaterialColetado findMaterialColetadoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "MaterialColetado"));
	}

	public List<MaterialColetado> getAllMaterialColetado(){
		return repository.findAll();
	}

	public void deleteMaterialColetado(long id){
		MaterialColetado obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "MaterialColetado"));
		repository.delete(obj);
	}	
	
	
	
}