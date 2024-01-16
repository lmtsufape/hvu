package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AnimalRequest;
import br.edu.ufape.hvu.controller.dto.response.AnimalResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


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
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			return new AnimalResponse(facade.saveAnimal(newObj.convertToEntity(), principal.getSubject()));
		} catch(RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor " + " not found.");
		}
		
	}
	
	@GetMapping("animal/{id}")
	public AnimalResponse getAnimalById(@PathVariable Long id) {
		try {
			return new AnimalResponse(facade.findAnimalById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("animal/{id}")
	public AnimalResponse updateAnimal(@PathVariable Long id, @Valid @RequestBody AnimalRequest obj) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			//Animal o = obj.convertToEntity();
			Animal oldObject = facade.findAnimalById(id);
			Tutor tutor = facade.findTutorByanimalId(oldObject.getId());
			if(!principal.getSubject().equals(tutor.getUserId())) {
				throw new AccessDeniedException("This is not your animal");
			}
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
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			Animal oldObject = facade.findAnimalById(id);
			Tutor tutor = facade.findTutorByanimalId(oldObject.getId());
			if(!principal.getSubject().equals(tutor.getUserId())) {
				throw new AccessDeniedException("This is not your animal");
			}
			facade.deleteAnimal(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
