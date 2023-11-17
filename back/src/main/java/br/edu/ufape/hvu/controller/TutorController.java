package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TutorRequest;
import br.edu.ufape.hvu.controller.dto.response.TutorResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class TutorController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tutor")
	public List<TutorResponse> getAllTutor() {
		return facade.getAllTutor()
			.stream()
			.map(TutorResponse::new)
			.toList();
	}
	
	@PostMapping("tutor")
	public TutorResponse createTutor(@Valid @RequestBody TutorRequest newObj) {
		return new TutorResponse(facade.saveTutor(newObj.convertToEntity()));
	}
	
	@GetMapping("tutor/{id}")
	public TutorResponse getTutorById(@PathVariable Long id) {
		try {
			return new TutorResponse(facade.findTutorById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tutor " + id + " not found.");
		}
	}
	
	@PatchMapping("tutor/{id}")
	public TutorResponse updateTutor(@PathVariable Long id, @Valid @RequestBody TutorRequest obj) {
		try {
			//Tutor o = obj.convertToEntity();
			Tutor oldObject = facade.findTutorById(id);

			TypeMap<TutorRequest, Tutor> typeMapper = modelMapper
													.typeMap(TutorRequest.class, Tutor.class)
													.addMappings(mapper -> mapper.skip(Tutor::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TutorResponse(facade.updateTutor(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tutor/{id}")
	public String deleteTutor(@PathVariable Long id) {
		try {
			facade.deleteTutor(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
