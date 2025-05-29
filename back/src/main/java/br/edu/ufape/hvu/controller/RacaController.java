package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.RacaRequest;
import br.edu.ufape.hvu.controller.dto.response.RacaResponse;
 
@RestController
@RequestMapping("/api/v1/")
public class RacaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@GetMapping("raca")
	public List<RacaResponse> getAllRaca() {
		return facade.getAllRaca()
			.stream()
			.map(RacaResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("raca")
	public RacaResponse createRaca(@Valid @RequestBody RacaRequest newObj) {
		return new RacaResponse(facade.saveRaca(newObj.convertToEntity()));
	}

	@GetMapping("raca/{id}")
	public RacaResponse getRacaById(@PathVariable Long id) {
		return new RacaResponse(facade.findRacaById(id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("raca/especie/{EspecieId}")
	public List<RacaResponse> findByEspecie(@PathVariable Long EspecieId) {
		return facade.findByEspecie(EspecieId)
			.stream()
			.map(RacaResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("raca/{id}")
	public RacaResponse updateRaca(@PathVariable Long id, @Valid @RequestBody RacaRequest obj) {
		return new RacaResponse(facade.updateRaca(obj, id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("raca/{id}")
	public String deleteRaca(@PathVariable Long id) {
		facade.deleteRaca(id);
		return "";
	}
}
