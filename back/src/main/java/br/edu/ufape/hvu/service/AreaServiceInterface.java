package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Area;

public interface AreaServiceInterface {
	Area saveArea(Area o);
	Area findAreaById(long id);
	Area updateArea(Area u);
	void deleteArea(long id);
	List<Area> getAllArea();
    
    

    
}