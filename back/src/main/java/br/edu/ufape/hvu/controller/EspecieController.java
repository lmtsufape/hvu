package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecieRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecieResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class EspecieController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("especie")
	public List<EspecieResponse> getAllEspecie() {
		return facade.getAllEspecie()
			.stream()
			.map(EspecieResponse::new)
			.toList();
	}
	
	@PostMapping("especie")
	public EspecieResponse createEspecie(@Valid @RequestBody EspecieRequest newObj) {
		return new EspecieResponse(facade.saveEspecie(newObj.convertToEntity()));
	}
	
	@GetMapping("especie/{id}")
	public EspecieResponse getEspecieById(@PathVariable Long id) {
		try {
			return new EspecieResponse(facade.findEspecieById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Especie " + id + " not found.");
		}
	}
	
	@PatchMapping("especie/{id}")
	public EspecieResponse updateEspecie(@PathVariable Long id, @Valid @RequestBody EspecieRequest obj) {
		try {
			//Especie o = obj.convertToEntity();
			Especie oldObject = facade.findEspecieById(id);

			TypeMap<EspecieRequest, Especie> typeMapper = modelMapper
													.typeMap(EspecieRequest.class, Especie.class)
													.addMappings(mapper -> mapper.skip(Especie::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EspecieResponse(facade.updateEspecie(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("especie/{id}")
	public String deleteEspecie(@PathVariable Long id) {
		try {
			facade.deleteEspecie(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
