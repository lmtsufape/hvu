package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AreaRequest;
import br.edu.ufape.hvu.controller.dto.response.AreaResponse;
 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class AreaController {
	private final Facade facade;

    @PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("area")
	public List<AreaResponse> getAllArea() {
		return facade.getAllArea()
			.stream()
			.map(AreaResponse::new)
			.toList();
	}

    @PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("area")
	public AreaResponse createArea(@Valid @RequestBody AreaRequest newObj) {
		return new AreaResponse(facade.saveArea(newObj.convertToEntity()));
	}

    @PreAuthorize("hasRole('PATOLOGISTA')")
	@GetMapping("area/{id}")
	public AreaResponse getAreaById(@PathVariable Long id) {
		return new AreaResponse(facade.findAreaById(id));
	}

    @PreAuthorize("hasRole('PATOLOGISTA')")
	@PatchMapping("area/{id}")
	public AreaResponse updateArea(@PathVariable Long id, @Valid @RequestBody AreaRequest obj) {
		return new AreaResponse(facade.updateArea(obj, id));
	}

    @PreAuthorize("hasRole('PATOLOGISTA')")
	@DeleteMapping("area/{id}")
	public String deleteArea(@PathVariable Long id) {
		facade.deleteArea(id);
		return "";
	}

}
