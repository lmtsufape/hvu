package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Medico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MedicoRequest;
import br.edu.ufape.hvu.controller.dto.response.MedicoResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class MedicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("medico")
	public List<MedicoResponse> getAllMedico() {
		return facade.getAllMedico()
			.stream()
			.map(MedicoResponse::new)
			.toList();
	}
	
	@PostMapping("medico")
	public MedicoResponse createMedico(@Valid @RequestBody MedicoRequest newObj) {
		return new MedicoResponse(facade.saveMedico(newObj.convertToEntity()));
	}
	
	@GetMapping("medico/{id}")
	public MedicoResponse getMedicoById(@PathVariable Long id) {
		try {
			return new MedicoResponse(facade.findMedicoById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Medico " + id + " not found.");
		}
	}
	
	@PatchMapping("medico/{id}")
	public MedicoResponse updateMedico(@PathVariable Long id, @Valid @RequestBody MedicoRequest obj) {
		try {
			//Medico o = obj.convertToEntity();
			Medico oldObject = facade.findMedicoById(id);

			TypeMap<MedicoRequest, Medico> typeMapper = modelMapper
													.typeMap(MedicoRequest.class, Medico.class)
													.addMappings(mapper -> mapper.skip(Medico::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new MedicoResponse(facade.updateMedico(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("medico/{id}")
	public String deleteMedico(@PathVariable Long id) {
		try {
			facade.deleteMedico(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
