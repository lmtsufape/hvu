package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.TipoPrognostico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoPrognosticoRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoPrognosticoResponse;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class TipoPrognosticoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tipoPrognostico")
	public List<TipoPrognosticoResponse> getAllTipoPrognostico() {
		return facade.getAllTipoPrognostico()
			.stream()
			.map(TipoPrognosticoResponse::new)
			.toList();
	}
	
	@PostMapping("tipoPrognostico")
	public TipoPrognosticoResponse createTipoPrognostico(@Valid @RequestBody TipoPrognosticoRequest newObj) {
		return new TipoPrognosticoResponse(facade.saveTipoPrognostico(newObj.convertToEntity()));
	}
	
	@GetMapping("tipoPrognostico/{id}")
	public TipoPrognosticoResponse getTipoPrognosticoById(@PathVariable Long id) {
		try {
			return new TipoPrognosticoResponse(facade.findTipoPrognosticoById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "TipoPrognostico " + id + " not found.");
		}
	}
	
	@PatchMapping("tipoPrognostico/{id}")
	public TipoPrognosticoResponse updateTipoPrognostico(@PathVariable Long id, @Valid @RequestBody TipoPrognosticoRequest obj) {
		try {
			//TipoPrognostico o = obj.convertToEntity();
			TipoPrognostico oldObject = facade.findTipoPrognosticoById(id);

			TypeMap<TipoPrognosticoRequest, TipoPrognostico> typeMapper = modelMapper
													.typeMap(TipoPrognosticoRequest.class, TipoPrognostico.class)
													.addMappings(mapper -> mapper.skip(TipoPrognostico::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new TipoPrognosticoResponse(facade.updateTipoPrognostico(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tipoPrognostico/{id}")
	public String deleteTipoPrognostico(@PathVariable Long id) {
		try {
			facade.deleteTipoPrognostico(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
