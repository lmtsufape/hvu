package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.LaudoNecropsia;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LaudoNecropsiaRequest;
import br.edu.ufape.hvu.controller.dto.response.LaudoNecropsiaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class LaudoNecropsiaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("laudoNecropsia")
	public List<LaudoNecropsiaResponse> getAllLaudoNecropsia() {
		return facade.getAllLaudoNecropsia()
			.stream()
			.map(LaudoNecropsiaResponse::new)
			.toList();
	}
	
	@PostMapping("laudoNecropsia")
	public LaudoNecropsiaResponse createLaudoNecropsia(@Valid @RequestBody LaudoNecropsiaRequest newObj) {
		return new LaudoNecropsiaResponse(facade.saveLaudoNecropsia(newObj.convertToEntity()));
	}
	
	@GetMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse getLaudoNecropsiaById(@PathVariable Long id) {
		try {
			return new LaudoNecropsiaResponse(facade.findLaudoNecropsiaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse updateLaudoNecropsia(@PathVariable Long id, @Valid @RequestBody LaudoNecropsiaRequest obj) {
		try {
			//LaudoNecropsia o = obj.convertToEntity();
			LaudoNecropsia oldObject = facade.findLaudoNecropsiaById(id);

			TypeMap<LaudoNecropsiaRequest, LaudoNecropsia> typeMapper = modelMapper
													.typeMap(LaudoNecropsiaRequest.class, LaudoNecropsia.class)
													.addMappings(mapper -> mapper.skip(LaudoNecropsia::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new LaudoNecropsiaResponse(facade.updateLaudoNecropsia(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("laudoNecropsia/{id}")
	public String deleteLaudoNecropsia(@PathVariable Long id) {
		try {
			facade.deleteLaudoNecropsia(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
