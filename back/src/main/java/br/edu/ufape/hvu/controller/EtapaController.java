package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EtapaRequest;
import br.edu.ufape.hvu.controller.dto.response.EtapaResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class EtapaController {
	private final Facade facade;

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("etapa")
	public List<EtapaResponse> getAllEtapa() {
		return facade.getAllEtapa()
			.stream()
			.map(EtapaResponse::new)
			.toList();
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PostMapping("etapa")
	public EtapaResponse createEtapa(@Valid @RequestBody EtapaRequest newObj) {
		return new EtapaResponse(facade.saveEtapa(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@GetMapping("etapa/{id}")
	public EtapaResponse getEtapaById(@PathVariable Long id) {
		return new EtapaResponse(facade.findEtapaById(id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@PatchMapping("etapa/{id}")
	public EtapaResponse updateEtapa(@PathVariable Long id, @Valid @RequestBody EtapaRequest obj) {
		return new EtapaResponse(facade.updateEtapa(obj, id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("etapa/{id}")
	public String deleteEtapa(@PathVariable Long id) {
		facade.deleteEtapa(id);
		return "";
	}
	

}
