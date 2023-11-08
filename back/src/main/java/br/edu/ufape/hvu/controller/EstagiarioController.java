package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Estagiario;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EstagiarioRequest;
import br.edu.ufape.hvu.controller.dto.response.EstagiarioResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class EstagiarioController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("estagiario")
	public List<EstagiarioResponse> getAllEstagiario() {
		return facade.getAllEstagiario()
			.stream()
			.map(EstagiarioResponse::new)
			.toList();
	}
	
	@PostMapping("estagiario")
	public EstagiarioResponse createEstagiario(@Valid @RequestBody EstagiarioRequest newObj) {
		return new EstagiarioResponse(facade.saveEstagiario(newObj.convertToEntity()));
	}
	
	@GetMapping("estagiario/{id}")
	public EstagiarioResponse getEstagiarioById(@PathVariable Long id) {
		try {
			return new EstagiarioResponse(facade.findEstagiarioById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Estagiario " + id + " not found.");
		}
	}
	
	@PatchMapping("estagiario/{id}")
	public EstagiarioResponse updateEstagiario(@PathVariable Long id, @Valid @RequestBody EstagiarioRequest obj) {
		try {
			//Estagiario o = obj.convertToEntity();
			Estagiario oldObject = facade.findEstagiarioById(id);

			TypeMap<EstagiarioRequest, Estagiario> typeMapper = modelMapper
													.typeMap(EstagiarioRequest.class, Estagiario.class)
													.addMappings(mapper -> mapper.skip(Estagiario::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EstagiarioResponse(facade.updateEstagiario(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("estagiario/{id}")
	public String deleteEstagiario(@PathVariable Long id) {
		try {
			facade.deleteEstagiario(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
