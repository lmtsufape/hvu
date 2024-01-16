package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Parecer;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ParecerRequest;
import br.edu.ufape.hvu.controller.dto.response.ParecerResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class ParecerController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("parecer")
	public List<ParecerResponse> getAllParecer() {
		return facade.getAllParecer()
			.stream()
			.map(ParecerResponse::new)
			.toList();
	}
	
	@PostMapping("parecer")
	public ParecerResponse createParecer(@Valid @RequestBody ParecerRequest newObj) {
		return new ParecerResponse(facade.saveParecer(newObj.convertToEntity()));
	}
	
	@GetMapping("parecer/{id}")
	public ParecerResponse getParecerById(@PathVariable Long id) {
		try {
			return new ParecerResponse(facade.findParecerById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("parecer/{id}")
	public ParecerResponse updateParecer(@PathVariable Long id, @Valid @RequestBody ParecerRequest obj) {
		try {
			//Parecer o = obj.convertToEntity();
			Parecer oldObject = facade.findParecerById(id);

			TypeMap<ParecerRequest, Parecer> typeMapper = modelMapper
													.typeMap(ParecerRequest.class, Parecer.class)
													.addMappings(mapper -> mapper.skip(Parecer::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new ParecerResponse(facade.updateParecer(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("parecer/{id}")
	public String deleteParecer(@PathVariable Long id) {
		try {
			facade.deleteParecer(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
