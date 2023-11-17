package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.ScoreCorporal;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ScoreCorporalRequest;
import br.edu.ufape.hvu.controller.dto.response.ScoreCorporalResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class ScoreCorporalController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("scoreCorporal")
	public List<ScoreCorporalResponse> getAllScoreCorporal() {
		return facade.getAllScoreCorporal()
			.stream()
			.map(ScoreCorporalResponse::new)
			.toList();
	}
	
	@PostMapping("scoreCorporal")
	public ScoreCorporalResponse createScoreCorporal(@Valid @RequestBody ScoreCorporalRequest newObj) {
		return new ScoreCorporalResponse(facade.saveScoreCorporal(newObj.convertToEntity()));
	}
	
	@GetMapping("scoreCorporal/{id}")
	public ScoreCorporalResponse getScoreCorporalById(@PathVariable Long id) {
		try {
			return new ScoreCorporalResponse(facade.findScoreCorporalById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "ScoreCorporal " + id + " not found.");
		}
	}
	
	@PatchMapping("scoreCorporal/{id}")
	public ScoreCorporalResponse updateScoreCorporal(@PathVariable Long id, @Valid @RequestBody ScoreCorporalRequest obj) {
		try {
			//ScoreCorporal o = obj.convertToEntity();
			ScoreCorporal oldObject = facade.findScoreCorporalById(id);

			TypeMap<ScoreCorporalRequest, ScoreCorporal> typeMapper = modelMapper
													.typeMap(ScoreCorporalRequest.class, ScoreCorporal.class)
													.addMappings(mapper -> mapper.skip(ScoreCorporal::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new ScoreCorporalResponse(facade.updateScoreCorporal(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("scoreCorporal/{id}")
	public String deleteScoreCorporal(@PathVariable Long id) {
		try {
			facade.deleteScoreCorporal(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
