package br.edu.ufape.hvu.controller;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import jakarta.validation.Valid;
import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TutorRequest;
import br.edu.ufape.hvu.controller.dto.response.TutorResponse;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class TutorController {
	private final Facade facade;

    @PreAuthorize("hasAnyRole('SECRETARIO', 'PATOLOGISTA')")
	@GetMapping("tutor")
	public List<TutorResponse> getAllTutor() {
		return facade.getAllTutor()
			.stream()
			.map(TutorResponse::new)
			.toList();
	}
	
	@PostMapping("tutor")
	public TutorResponse createTutor(@Valid @RequestBody TutorRequest newObj) {
		String password = newObj.getSenha();
		Tutor o = newObj.convertToEntity();
		return new TutorResponse(facade.saveTutor(o, password));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'TUTOR', 'PATOLOGISTA')")
	@GetMapping("tutor/{id}")
	public TutorResponse getTutorById(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new TutorResponse(facade.findTutorById(id, principal.getSubject()));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'PATOLOGISTA', 'MEDICO')")
	@GetMapping("tutor/animal/{id}")
	public TutorResponse getTutorByAnimalId(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt principal = (Jwt) authentication.getPrincipal();

		return new TutorResponse(facade.findTutorByanimalId(id, principal.getSubject()));
	}

    @PreAuthorize("hasAnyRole('SECRETARIO', 'TUTOR')")
	@PatchMapping("tutor/{id}")
	public TutorResponse updateTutor(@PathVariable Long id, @Valid @RequestBody TutorRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new TutorResponse(facade.updateTutor(id, obj, principal.getSubject()));
    }

    @PreAuthorize("hasRole('SECRETARIO')")
	@DeleteMapping("tutor/{id}")
	public String deleteTutor(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		facade.deleteTutor(id, principal.getSubject());
		return "";
	}

}
