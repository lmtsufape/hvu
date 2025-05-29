package br.edu.ufape.hvu.controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TipoConsultaRequest;
import br.edu.ufape.hvu.controller.dto.response.TipoConsultaResponse;


@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class TipoConsultaController {
	private final Facade facade;

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("tipoConsulta")
	public List<TipoConsultaResponse> getAllTipoConsulta() {
		return facade.getAllTipoConsulta()
			.stream()
			.map(TipoConsultaResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("tipoConsulta")
	public TipoConsultaResponse createTipoConsulta(@Valid @RequestBody TipoConsultaRequest newObj) {
		return new TipoConsultaResponse(facade.saveTipoConsulta(newObj.convertToEntity()));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("tipoConsulta/{id}")
	public TipoConsultaResponse getTipoConsultaById(@PathVariable Long id) {
		return new TipoConsultaResponse(facade.findTipoConsultaById(id));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("tipoConsulta/{id}")
	public TipoConsultaResponse updateTipoConsulta(@PathVariable Long id, @Valid @RequestBody TipoConsultaRequest obj) {
		return new TipoConsultaResponse(facade.updateTipoConsulta(id, obj));
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("tipoConsulta/{id}")
	public String deleteTipoConsulta(@PathVariable Long id) {
		facade.deleteTipoConsulta(id);
		return "";
	}
}
