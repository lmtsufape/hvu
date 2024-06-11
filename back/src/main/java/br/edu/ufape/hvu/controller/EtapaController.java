package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Etapa;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EtapaRequest;
import br.edu.ufape.hvu.controller.dto.response.EtapaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class EtapaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("etapa")
	public List<EtapaResponse> getAllEtapa() {
		return facade.getAllEtapa()
			.stream()
			.map(EtapaResponse::new)
			.toList();
	}
	
	@PostMapping("etapa")
	public EtapaResponse createEtapa(@Valid @RequestBody EtapaRequest newObj) {
		return new EtapaResponse(facade.saveEtapa(newObj.convertToEntity()));
	}
	
	@GetMapping("etapa/{id}")
	public EtapaResponse getEtapaById(@PathVariable Long id) {
		try {
			return new EtapaResponse(facade.findEtapaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("etapa/{id}")
	public EtapaResponse updateEtapa(@PathVariable Long id, @Valid @RequestBody EtapaRequest obj) {
		try {
			//Etapa o = obj.convertToEntity();
			Etapa oldObject = facade.findEtapaById(id);

			TypeMap<EtapaRequest, Etapa> typeMapper = modelMapper
													.typeMap(EtapaRequest.class, Etapa.class)
													.addMappings(mapper -> mapper.skip(Etapa::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EtapaResponse(facade.updateEtapa(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("etapa/{id}")
	public String deleteEtapa(@PathVariable Long id) {
		try {
			facade.deleteEtapa(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
