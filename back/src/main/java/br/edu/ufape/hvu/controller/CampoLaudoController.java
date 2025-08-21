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

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("campoLaudo")
	public List<CampoLaudoResponse> getAllCampoLaudo() {
		return facade.getAllCampoLaudo()
			.stream()
			.map(CampoLaudoResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("campoLaudo")
	public CampoLaudoResponse createCampoLaudo(@Valid @RequestBody CampoLaudoRequest newObj) {
		return new CampoLaudoResponse(facade.saveCampoLaudo(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("campoLaudo/{id}")
	public CampoLaudoResponse getCampoLaudoById(@PathVariable Long id) {
		return new CampoLaudoResponse(facade.findCampoLaudoById(id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("campoLaudo/{id}")
	public CampoLaudoResponse updateCampoLaudo(@PathVariable Long id, @Valid @RequestBody CampoLaudoRequest obj) {
		return new CampoLaudoResponse(facade.updateCampoLaudo(obj, id));
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("campoLaudo/{id}")
	public String deleteCampoLaudo(@PathVariable Long id) {
		facade.deleteCampoLaudo(id);
		return "";
	}

}
