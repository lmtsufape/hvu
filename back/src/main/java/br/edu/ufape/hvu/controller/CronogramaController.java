package br.edu.ufape.hvu.controller;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import br.edu.ufape.hvu.controller.dto.request.CronogramaRequest;
import br.edu.ufape.hvu.controller.dto.response.CronogramaResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;


 
@RestController
@RequestMapping("/api/v1/")
public class CronogramaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@GetMapping("cronograma")
	public List<CronogramaResponse> getAllCronograma() {
		return facade.getAllCronograma()
			.stream()
			.map(CronogramaResponse::new)
			.toList();
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PostMapping("cronograma")
	public CronogramaResponse createCronograma(@Valid @RequestBody CronogramaRequest newObj) {
		return new CronogramaResponse(facade.saveCronograma(newObj.convertToEntity()));
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
	@GetMapping("cronograma/{id}")
	public CronogramaResponse getCronogramaById(@PathVariable Long id) {
		return new CronogramaResponse(facade.findCronogramaById(id));
	}
	
	@GetMapping("cronograma/medico/{id}")
	public List<CronogramaResponse> getCronogramaByMedicoId(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return facade.findCronogramaByMedicoId(id, principal.getSubject()).stream()
					.map(CronogramaResponse::new)
					.toList();
	}
	
	@GetMapping("cronograma/especialidade/{id}")
	public List<CronogramaResponse> getCronogramaByEspecialidadeId(@PathVariable Long id) {
		return facade.findCronogramaByEspecialidadeId(id).stream()
					.map(CronogramaResponse::new)
					.toList();

	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@PatchMapping("cronograma/{id}")
	public CronogramaResponse updateCronograma(@PathVariable Long id, @Valid @RequestBody CronogramaRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new CronogramaResponse(facade.updateCronograma(obj, id, principal.getSubject()));
		
	}

	@PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("cronograma/{id}")
	public String deleteCronograma(@PathVariable Long id) {
		facade.deleteCronograma(id);
		return "";
	}
}
