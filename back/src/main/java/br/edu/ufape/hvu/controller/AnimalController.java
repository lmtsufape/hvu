package br.edu.ufape.hvu.controller;

import java.util.List;

import br.edu.ufape.hvu.controller.dto.request.PatologistaAnimalRequest;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import lombok.RequiredArgsConstructor;
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
import br.edu.ufape.hvu.controller.dto.request.AnimalRequest;
import br.edu.ufape.hvu.controller.dto.response.AnimalResponse;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Animal;
import jakarta.validation.Valid;



@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class AnimalController {
	private final Facade facade;

	@PreAuthorize("hasAnyRole('PATOLOGISTA')")
	@GetMapping("animal")
	public List<AnimalResponse> getAllAnimal() {
		return facade.getAllAnimal()
				.stream()
				.map(AnimalResponse::new)
				.toList();
	}

	@GetMapping("animal/retorno")
	public List<AnimalResponse> findAnimaisWithReturn() {
		return facade.findAnimaisWithReturn()
				.stream()
				.map(AnimalResponse::new)
				.toList();
	}

	@GetMapping("animal/semRetorno")
	public List<AnimalResponse> findAnimaisWithoutReturn() {
		return facade.findAnimaisWithoutReturn()
				.stream()
				.map(AnimalResponse::new)
				.toList();
	}


	@GetMapping("animal/retorno/{id}")
	public String verificaSeAnimalPodeMarcarPrimeiraConsultaRetornoOuConsulta(@PathVariable Long id) {
		return facade.verificaSeAnimalPodeMarcarPrimeiraConsultaRetornoOuConsulta(id);
	}

	@PreAuthorize("hasRole('TUTOR')")
	@GetMapping("animal/tutor")
	public List<AnimalResponse> getAllAnimalTutor() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		return facade.getAllAnimalTutor(principal.getSubject())
				.stream()
				.map(AnimalResponse::new)
				.toList();
	}

	@GetMapping("animal/numeroficha/{fichaNumero}")
	public AnimalResponse getAnimaisByNumeroficha(@PathVariable String fichaNumero) {
		Animal animals = facade.getAnimalByFichaNumber(fichaNumero);
		return new AnimalResponse(animals);
	}

	@PreAuthorize("hasRole('TUTOR')")
	@PostMapping("animal")
	public AnimalResponse createAnimal(@Valid @RequestBody AnimalRequest newObj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AnimalResponse(facade.saveAnimal(newObj.convertToEntity(), principal.getSubject()));
	}

	@GetMapping("animal/{id}")
	public AnimalResponse getAnimalById(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AnimalResponse(facade.findAnimalById(id, principal.getSubject()));
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@PatchMapping("animal/{id}")
	public AnimalResponse updateAnimal(@PathVariable Long id, @Valid @RequestBody AnimalRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new AnimalResponse(facade.updateAnimal(id, obj, principal.getSubject()));
	}

	@DeleteMapping("animal/{id}")
	public String deleteAnimal(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		facade.deleteAnimal(id, principal.getSubject());
		return "";
	}

	@PreAuthorize("hasRole('PATOLOGISTA')")
	@PostMapping("animal/patologista")
	public AnimalResponse createAnimalByPatologista(
			@Valid @RequestBody PatologistaAnimalRequest request
	) {
		Animal saved = facade.saveAnimalByPatologista(
				request.getAnimalEntity(),
				request.getTutorEntity()
		);
		return new AnimalResponse(saved);
	}

	@GetMapping("/animal/origem/{origem}")
	public List<Animal> getAnimalsByOrigemAnimal(@PathVariable OrigemAnimal origem) {
		return facade.findAnimalsByOrigemAnimal(origem);
	}
}
