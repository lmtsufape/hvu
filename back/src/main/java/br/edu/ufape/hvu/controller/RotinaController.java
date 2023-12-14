package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Rotina;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.RotinaRequest;
import br.edu.ufape.hvu.controller.dto.response.RotinaResponse;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class RotinaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("rotina")
	public List<RotinaResponse> getAllRotina() {
		return facade.getAllRotina()
			.stream()
			.map(RotinaResponse::new)
			.toList();
	}
	
	@PostMapping("rotina")
	public RotinaResponse createRotina(@Valid @RequestBody RotinaRequest newObj) {
		return new RotinaResponse(facade.saveRotina(newObj.convertToEntity()));
	}
	
	@GetMapping("rotina/{id}")
	public RotinaResponse getRotinaById(@PathVariable Long id) {
		try {
			return new RotinaResponse(facade.findRotinaById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Rotina " + id + " not found.");
		}
	}
	
	@PatchMapping("rotina/{id}")
	public RotinaResponse updateRotina(@PathVariable Long id, @Valid @RequestBody RotinaRequest obj) {
		try {
			//Rotina o = obj.convertToEntity();
			Rotina oldObject = facade.findRotinaById(id);

			TypeMap<RotinaRequest, Rotina> typeMapper = modelMapper
													.typeMap(RotinaRequest.class, Rotina.class)
													.addMappings(mapper -> mapper.skip(Rotina::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new RotinaResponse(facade.updateRotina(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("rotina/{id}")
	public String deleteRotina(@PathVariable Long id) {
		try {
			facade.deleteRotina(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
