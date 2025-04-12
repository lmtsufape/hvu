package br.edu.ufape.hvu.controller;

import java.util.List;

import br.edu.ufape.hvu.exception.types.auth.ForbiddenOperationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import br.edu.ufape.hvu.model.Tutor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.TutorRequest;
import br.edu.ufape.hvu.controller.dto.response.TutorResponse;

 
@RestController
@RequestMapping("/api/v1/")
public class TutorController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO')")
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
	
	@GetMapping("tutor/{id}")
	public TutorResponse getTutorById(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new TutorResponse(facade.findTutorById(id, principal.getSubject()));
	}
	
	@GetMapping("tutor/animal/{id}")
	public TutorResponse getTutorByAnimalId(@PathVariable Long id) {
		return new TutorResponse(facade.findTutorByanimalId(id));
	}

	@PatchMapping("tutor/{id}")
	public TutorResponse updateTutor(@PathVariable Long id, @Valid @RequestBody TutorRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		Tutor o = obj.convertToEntity();
		Tutor oldObject = facade.findTutorById(id, principal.getSubject());

		
		TypeMap<Tutor, Tutor> typeMapper = modelMapper
				.typeMap(Tutor.class, Tutor.class)
				.addMappings(mapper -> mapper.skip(Tutor::setId));

		typeMapper.map(o, oldObject);
		return new TutorResponse(facade.updateTutor(oldObject));
    }
	
	@DeleteMapping("tutor/{id}")
	public String deleteTutor(@PathVariable Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
			
		Tutor oldObject = facade.findTutorById(id, principal.getSubject());
			
		if(!principal.getSubject().equals(oldObject.getUserId())) {
			throw new ForbiddenOperationException("Está não é sua conta");
		}

		facade.deleteTutor(id, principal.getSubject());
		return "";
	}
}
