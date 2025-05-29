package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.CampoLaudo;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.CampoLaudoRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoResponse;


 
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
		return new CampoLaudoResponse(facade.findCampoLaudoById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("campoLaudo/{id}")
	public CampoLaudoResponse updateCampoLaudo(@PathVariable Long id, @Valid @RequestBody CampoLaudoRequest obj) {
		//CampoLaudo o = obj.convertToEntity();
		CampoLaudo oldObject = facade.findCampoLaudoById(id);

		TypeMap<CampoLaudoRequest, CampoLaudo> typeMapper = modelMapper
													.typeMap(CampoLaudoRequest.class, CampoLaudo.class)
													.addMappings(mapper -> mapper.skip(CampoLaudo::setId));			
			
			
		typeMapper.map(obj, oldObject);
		return new CampoLaudoResponse(facade.updateCampoLaudo(oldObject));
		
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("campoLaudo/{id}")
	public String deleteCampoLaudo(@PathVariable Long id) {
		facade.deleteCampoLaudo(id);
		return "";
	}
	

}
