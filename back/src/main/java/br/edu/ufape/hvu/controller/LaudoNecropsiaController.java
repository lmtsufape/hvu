package br.edu.ufape.hvu.controller;

import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
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
		return new LaudoNecropsiaResponse(facade.updateLaudoNecropsia(obj, id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("laudoNecropsia/{id}")
	public String deleteLaudoNecropsia(@PathVariable Long id) {
		facade.deleteLaudoNecropsia(id);
		return "";
	}


}