package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.MaterialColetadoRepository;
import br.edu.ufape.hvu.model.MaterialColetado;

@Service
public class MaterialColetadoService implements MaterialColetadoServiceInterface {
	@Autowired
	private MaterialColetadoRepository repository;


	public MaterialColetado saveMaterialColetado(MaterialColetado newInstance) {
		return repository.save(newInstance);
	}

	public MaterialColetado updateMaterialColetado(MaterialColetado transientObject) {
		return repository.save(transientObject);
	}

	public MaterialColetado findMaterialColetadoById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist MaterialColetado with id = " + id));
	}

	public List<MaterialColetado> getAllMaterialColetado(){
		return repository.findAll();
	}

	public void deleteMaterialColetado(MaterialColetado persistentObject){
		this.deleteMaterialColetado(persistentObject.getId());
		
	}
	
	public void deleteMaterialColetado(long id){
		MaterialColetado obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist MaterialColetado with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}