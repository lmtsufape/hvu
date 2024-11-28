package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.CampoLaudo;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.CampoLaudoRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class CampoLaudoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("campoLaudo")
	public List<CampoLaudoResponse> getAllCampoLaudo() {
		return facade.getAllCampoLaudo()
			.stream()
			.map(CampoLaudoResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("campoLaudo")
	public CampoLaudoResponse createCampoLaudo(@Valid @RequestBody CampoLaudoRequest newObj) {
		return new CampoLaudoResponse(facade.saveCampoLaudo(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("campoLaudo/{id}")
	public CampoLaudoResponse getCampoLaudoById(@PathVariable Long id) {
		try {
			return new CampoLaudoResponse(facade.findCampoLaudoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("campoLaudo/{id}")
	public CampoLaudoResponse updateCampoLaudo(@PathVariable Long id, @Valid @RequestBody CampoLaudoRequest obj) {
		try {
			//CampoLaudo o = obj.convertToEntity();
			CampoLaudo oldObject = facade.findCampoLaudoById(id);

			TypeMap<CampoLaudoRequest, CampoLaudo> typeMapper = modelMapper
													.typeMap(CampoLaudoRequest.class, CampoLaudo.class)
													.addMappings(mapper -> mapper.skip(CampoLaudo::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new CampoLaudoResponse(facade.updateCampoLaudo(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("campoLaudo/{id}")
	public String deleteCampoLaudo(@PathVariable Long id) {
		try {
			facade.deleteCampoLaudo(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
