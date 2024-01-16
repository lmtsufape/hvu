package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Prescricao;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.PrescricaoRequest;
import br.edu.ufape.hvu.controller.dto.response.PrescricaoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class PrescricaoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("prescricao")
	public List<PrescricaoResponse> getAllPrescricao() {
		return facade.getAllPrescricao()
			.stream()
			.map(PrescricaoResponse::new)
			.toList();
	}
	
	@PostMapping("prescricao")
	public PrescricaoResponse createPrescricao(@Valid @RequestBody PrescricaoRequest newObj) {
		return new PrescricaoResponse(facade.savePrescricao(newObj.convertToEntity()));
	}
	
	@GetMapping("prescricao/{id}")
	public PrescricaoResponse getPrescricaoById(@PathVariable Long id) {
		try {
			return new PrescricaoResponse(facade.findPrescricaoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("prescricao/{id}")
	public PrescricaoResponse updatePrescricao(@PathVariable Long id, @Valid @RequestBody PrescricaoRequest obj) {
		try {
			//Prescricao o = obj.convertToEntity();
			Prescricao oldObject = facade.findPrescricaoById(id);

			TypeMap<PrescricaoRequest, Prescricao> typeMapper = modelMapper
													.typeMap(PrescricaoRequest.class, Prescricao.class)
													.addMappings(mapper -> mapper.skip(Prescricao::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new PrescricaoResponse(facade.updatePrescricao(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("prescricao/{id}")
	public String deletePrescricao(@PathVariable Long id) {
		try {
			facade.deletePrescricao(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
