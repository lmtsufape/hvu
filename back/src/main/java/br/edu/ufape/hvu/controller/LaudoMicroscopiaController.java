package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.LaudoMicroscopia;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LaudoMicroscopiaRequest;
import br.edu.ufape.hvu.controller.dto.response.LaudoMicroscopiaResponse;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class LaudoMicroscopiaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("laudoMicroscopia")
	public List<LaudoMicroscopiaResponse> getAllLaudoMicroscopia() {
		return facade.getAllLaudoMicroscopia()
			.stream()
			.map(LaudoMicroscopiaResponse::new)
			.toList();
	}
	
	@PostMapping("laudoMicroscopia")
	public LaudoMicroscopiaResponse createLaudoMicroscopia(@Valid @RequestBody LaudoMicroscopiaRequest newObj) {
		return new LaudoMicroscopiaResponse(facade.saveLaudoMicroscopia(newObj.convertToEntity()));
	}
	
	@GetMapping("laudoMicroscopia/{id}")
	public LaudoMicroscopiaResponse getLaudoMicroscopiaById(@PathVariable Long id) {
		try {
			return new LaudoMicroscopiaResponse(facade.findLaudoMicroscopiaById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "LaudoMicroscopia " + id + " not found.");
		}
	}
	
	@PatchMapping("laudoMicroscopia/{id}")
	public LaudoMicroscopiaResponse updateLaudoMicroscopia(@PathVariable Long id, @Valid @RequestBody LaudoMicroscopiaRequest obj) {
		try {
			//LaudoMicroscopia o = obj.convertToEntity();
			LaudoMicroscopia oldObject = facade.findLaudoMicroscopiaById(id);

			TypeMap<LaudoMicroscopiaRequest, LaudoMicroscopia> typeMapper = modelMapper
													.typeMap(LaudoMicroscopiaRequest.class, LaudoMicroscopia.class)
													.addMappings(mapper -> mapper.skip(LaudoMicroscopia::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new LaudoMicroscopiaResponse(facade.updateLaudoMicroscopia(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("laudoMicroscopia/{id}")
	public String deleteLaudoMicroscopia(@PathVariable Long id) {
		try {
			facade.deleteLaudoMicroscopia(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
