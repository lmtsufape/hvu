package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LaudoNecropsiaRequest;
import br.edu.ufape.hvu.controller.dto.response.LaudoNecropsiaResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class LaudoNecropsiaController {
	private final Facade facade;

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("laudoNecropsia")
	public List<LaudoNecropsiaResponse> getAllLaudoNecropsia() {
		return facade.getAllLaudoNecropsia()
				.stream()
				.map(LaudoNecropsiaResponse::new)
				.toList();
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("laudoNecropsia")
	public LaudoNecropsiaResponse createLaudoNecropsia(@Valid @RequestBody LaudoNecropsiaRequest newObj) {
		return new LaudoNecropsiaResponse(facade.saveLaudoNecropsia(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse getLaudoNecropsiaById(@PathVariable Long id) {
		return new LaudoNecropsiaResponse(facade.findLaudoNecropsiaById(id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("laudoNecropsia/{id}")
	public LaudoNecropsiaResponse updateLaudoNecropsia(@PathVariable Long id, @Valid @RequestBody LaudoNecropsiaRequest obj) {
		return new LaudoNecropsiaResponse(facade.updateLaudoNecropsia(obj, id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("laudoNecropsia/{id}")
	public String deleteLaudoNecropsia(@PathVariable Long id) {
		facade.deleteLaudoNecropsia(id);
		return "";
	}


}