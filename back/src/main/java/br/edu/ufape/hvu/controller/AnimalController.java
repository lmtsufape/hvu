package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AnimalRequest;
import br.edu.ufape.hvu.controller.dto.response.AnimalResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class AnimalController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("animal")
	public List<AnimalResponse> getAllAnimal() {
		return facade.getAllAnimal()
			.stream()
			.map(AnimalResponse::new)
			.toList();
	}
	
	@PostMapping("animal")
	public AnimalResponse createAnimal(@Valid @RequestBody AnimalRequest newObj) {
		return new AnimalResponse(facade.saveAnimal(newObj.convertToEntity()));
	}
	
	@GetMapping("animal/{id}")
	public AnimalResponse getAnimalById(@PathVariable Long id) {
		try {
			return new AnimalResponse(facade.findAnimalById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Animal " + id + " not found.");
		}
	}
	
	@PatchMapping("animal/{id}")
	public AnimalResponse updateAnimal(@PathVariable Long id, @Valid @RequestBody AnimalRequest obj) {
		try {
			//Animal o = obj.convertToEntity();
			Animal oldObject = facade.findAnimalById(id);

			TypeMap<AnimalRequest, Animal> typeMapper = modelMapper
													.typeMap(AnimalRequest.class, Animal.class)
													.addMappings(mapper -> mapper.skip(Animal::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new AnimalResponse(facade.updateAnimal(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("animal/{id}")
	public String deleteAnimal(@PathVariable Long id) {
		try {
			facade.deleteAnimal(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
