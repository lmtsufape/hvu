package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EspecialidadeRequest;
import br.edu.ufape.hvu.controller.dto.response.EspecialidadeResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class EspecialidadeController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("especialidade")
	public List<EspecialidadeResponse> getAllEspecialidade() {
		return facade.getAllEspecialidade()
			.stream()
			.map(EspecialidadeResponse::new)
			.toList();
	}
	
	@PostMapping("especialidade")
	public EspecialidadeResponse createEspecialidade(@Valid @RequestBody EspecialidadeRequest newObj) {
		return new EspecialidadeResponse(facade.saveEspecialidade(newObj.convertToEntity()));
	}
	
	@GetMapping("especialidade/{id}")
	public EspecialidadeResponse getEspecialidadeById(@PathVariable Long id) {
		try {
			return new EspecialidadeResponse(facade.findEspecialidadeById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Especialidade " + id + " not found.");
		}
	}
	
	@PatchMapping("especialidade/{id}")
	public EspecialidadeResponse updateEspecialidade(@PathVariable Long id, @Valid @RequestBody EspecialidadeRequest obj) {
		try {
			//Especialidade o = obj.convertToEntity();
			Especialidade oldObject = facade.findEspecialidadeById(id);

			TypeMap<EspecialidadeRequest, Especialidade> typeMapper = modelMapper
													.typeMap(EspecialidadeRequest.class, Especialidade.class)
													.addMappings(mapper -> mapper.skip(Especialidade::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EspecialidadeResponse(facade.updateEspecialidade(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("especialidade/{id}")
	public String deleteEspecialidade(@PathVariable Long id) {
		try {
			facade.deleteEspecialidade(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
