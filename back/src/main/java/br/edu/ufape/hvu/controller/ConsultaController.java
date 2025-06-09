package br.edu.ufape.hvu.controller;

import java.util.List;

import br.edu.ufape.hvu.model.Animal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.model.Consulta;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.ConsultaRequest;
import br.edu.ufape.hvu.controller.dto.response.ConsultaResponse;


 
@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class ConsultaController {
	private final Facade facade;
	
	@GetMapping("consulta")
	public List<ConsultaResponse> getAllConsulta() {
		return facade.getAllConsulta()
			.stream()
			.map(ConsultaResponse::new)
			.toList();
	}

	@PostMapping("consulta/{id}")
	public ConsultaResponse createConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequest newObj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		Animal animal = facade.findAnimalById(newObj.getAnimal().getId(), principal.getSubject());
		Consulta consulta = newObj.convertToEntity();
		consulta.setAnimal(animal);

		return new ConsultaResponse(facade.saveConsulta(id, consulta));
	}
	
	@GetMapping("consulta/{id}")
	public ConsultaResponse getConsultaById(@PathVariable Long id) {
		return new ConsultaResponse(facade.findConsultaById(id));
	}

	@GetMapping("consulta/numeroficha/{numeroficha}")
	public List<ConsultaResponse> getConsultasByAnimalNumeroFicha (@PathVariable String numeroficha) {
		List<Consulta> consutas = facade.getConsultasByAnimalFichaNumero(numeroficha);
		return consutas
				.stream()
				.map(ConsultaResponse::new)
				.toList();
	}

	@GetMapping("consulta/animalid/{id}")
	public List<ConsultaResponse> getConsultaByAnimalId(@PathVariable Long id){
		List<Consulta> consultas = facade.getConsultaByAnimalId(id);
		return consultas.stream()
				.map(ConsultaResponse::new)
				.toList();
	}
	
	@PatchMapping("consulta/{id}")
	public ConsultaResponse updateConsulta(@PathVariable Long id, @Valid @RequestBody ConsultaRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		return new ConsultaResponse(facade.updateConsulta(obj, id, principal.getSubject()));
	}
	
	@DeleteMapping("consulta/{id}")
	public String deleteConsulta(@PathVariable Long id) {
		facade.deleteConsulta(id);
		return "";
	}
}
