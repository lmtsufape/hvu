package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.CampoLaudoRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class CampoLaudoController {
	private final Facade facade;

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
		return new CampoLaudoResponse(facade.updateCampoLaudo(obj, id));
	}

	@PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
	@DeleteMapping("campoLaudo/{id}")
	public String deleteCampoLaudo(@PathVariable Long id) {
		facade.deleteCampoLaudo(id);
		return "";
	}

}
