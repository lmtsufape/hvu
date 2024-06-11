package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.MaterialColetado;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.MaterialColetadoRequest;
import br.edu.ufape.hvu.controller.dto.response.MaterialColetadoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class MaterialColetadoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("materialColetado")
	public List<MaterialColetadoResponse> getAllMaterialColetado() {
		return facade.getAllMaterialColetado()
			.stream()
			.map(MaterialColetadoResponse::new)
			.toList();
	}
	
	@PostMapping("materialColetado")
	public MaterialColetadoResponse createMaterialColetado(@Valid @RequestBody MaterialColetadoRequest newObj) {
		return new MaterialColetadoResponse(facade.saveMaterialColetado(newObj.convertToEntity()));
	}
	
	@GetMapping("materialColetado/{id}")
	public MaterialColetadoResponse getMaterialColetadoById(@PathVariable Long id) {
		try {
			return new MaterialColetadoResponse(facade.findMaterialColetadoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("materialColetado/{id}")
	public MaterialColetadoResponse updateMaterialColetado(@PathVariable Long id, @Valid @RequestBody MaterialColetadoRequest obj) {
		try {
			//MaterialColetado o = obj.convertToEntity();
			MaterialColetado oldObject = facade.findMaterialColetadoById(id);

			TypeMap<MaterialColetadoRequest, MaterialColetado> typeMapper = modelMapper
													.typeMap(MaterialColetadoRequest.class, MaterialColetado.class)
													.addMappings(mapper -> mapper.skip(MaterialColetado::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new MaterialColetadoResponse(facade.updateMaterialColetado(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("materialColetado/{id}")
	public String deleteMaterialColetado(@PathVariable Long id) {
		try {
			facade.deleteMaterialColetado(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
