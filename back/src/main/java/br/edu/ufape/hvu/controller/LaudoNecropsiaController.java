package br.edu.ufape.hvu.controller;

import java.util.List;
import java.util.stream.Collectors;

import br.edu.ufape.hvu.model.CampoLaudo;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.LaudoNecropsia;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LaudoNecropsiaRequest;
import br.edu.ufape.hvu.controller.dto.response.LaudoNecropsiaResponse;
 
@RestController
@RequestMapping("/api/v1/")
public class LaudoNecropsiaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("laudoNecropsia")
	public List<LaudoNecropsiaResponse> getAllLaudoNecropsia() {
		return facade.getAllLaudoNecropsia()
				.stream()
				.map(LaudoNecropsiaResponse::new)
				.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("laudoNecropsia")
	public LaudoNecropsiaResponse createLaudoNecropsia(@Valid @RequestBody LaudoNecropsiaRequest newObj) {
		return new LaudoNecropsiaResponse(facade.saveLaudoNecropsia(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse getLaudoNecropsiaById(@PathVariable Long id) {
		return new LaudoNecropsiaResponse(facade.findLaudoNecropsiaById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse updateLaudoNecropsia(@PathVariable Long id, @Valid @RequestBody LaudoNecropsiaRequest obj) {
			LaudoNecropsia oldObject = facade.findLaudoNecropsiaById(id);

			// campoLaudo
			if(obj.getCampoLaudo() != null && !obj.getCampoLaudo().isEmpty()){
				List<CampoLaudo> updatedCampoLaudos = obj.getCampoLaudo().stream()
						.map(campo -> facade.findCampoLaudoById(campo.getId()))
						.collect(Collectors.toList());
				oldObject.setCampoLaudo(updatedCampoLaudos);
				obj.setCampoLaudo(null); // Limpar para evitar mapeamento duplo
			}

			TypeMap<LaudoNecropsiaRequest, LaudoNecropsia> typeMapper = modelMapper
					.typeMap(LaudoNecropsiaRequest.class, LaudoNecropsia.class)
					.addMappings(mapper -> mapper.skip(LaudoNecropsia::setId));

			typeMapper.map(obj, oldObject);
			return new LaudoNecropsiaResponse(facade.updateLaudoNecropsia(oldObject));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("laudoNecropsia/{id}")
	public String deleteLaudoNecropsia(@PathVariable Long id) {
		facade.deleteLaudoNecropsia(id);
		return "";
	}


}