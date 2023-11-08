package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Diretor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.DiretorRequest;
import br.edu.ufape.hvu.controller.dto.response.DiretorResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class DiretorController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("diretor")
	public List<DiretorResponse> getAllDiretor() {
		return facade.getAllDiretor()
			.stream()
			.map(DiretorResponse::new)
			.toList();
	}
	
	@PostMapping("diretor")
	public DiretorResponse createDiretor(@Valid @RequestBody DiretorRequest newObj) {
		return new DiretorResponse(facade.saveDiretor(newObj.convertToEntity()));
	}
	
	@GetMapping("diretor/{id}")
	public DiretorResponse getDiretorById(@PathVariable Long id) {
		try {
			return new DiretorResponse(facade.findDiretorById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Diretor " + id + " not found.");
		}
	}
	
	@PatchMapping("diretor/{id}")
	public DiretorResponse updateDiretor(@PathVariable Long id, @Valid @RequestBody DiretorRequest obj) {
		try {
			//Diretor o = obj.convertToEntity();
			Diretor oldObject = facade.findDiretorById(id);

			TypeMap<DiretorRequest, Diretor> typeMapper = modelMapper
													.typeMap(DiretorRequest.class, Diretor.class)
													.addMappings(mapper -> mapper.skip(Diretor::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new DiretorResponse(facade.updateDiretor(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("diretor/{id}")
	public String deleteDiretor(@PathVariable Long id) {
		try {
			facade.deleteDiretor(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
