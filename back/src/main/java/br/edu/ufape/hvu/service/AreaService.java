package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.AreaRepository;
import br.edu.ufape.hvu.model.Area;

@Service
public class AreaService implements AreaServiceInterface {
	@Autowired
	private AreaRepository repository;


	public Area saveArea(Area newInstance) {
		return repository.save(newInstance);
	}

	public Area updateArea(Area transientObject) {
		return repository.save(transientObject);
	}

	public Area findAreaById(long id) {
		return repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Area with id = " + id));
	}

	public List<Area> getAllArea(){
		return repository.findAll();
	}

	public void deleteArea(Area persistentObject){
		this.deleteArea(persistentObject.getId());
		
	}
	
	public void deleteArea(long id){
		Area obj = repository.findById(id).orElseThrow( () -> new RuntimeException("It doesn't exist Area with id = " + id));
		repository.delete(obj);
	}	
	
	
	
}