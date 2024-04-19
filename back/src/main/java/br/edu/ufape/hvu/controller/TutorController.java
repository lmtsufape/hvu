package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
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
import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class TutorController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("tutor")
	public List<TutorResponse> getAllTutor() {
		return facade.getAllTutor()
			.stream()
			.map(TutorResponse::new)
			.toList();
	}
	
	@PostMapping("tutor")
	public TutorResponse createTutor(@Valid @RequestBody TutorRequest newObj) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			facade.findDuplicateAccountByuserId(principal.getSubject());
			Tutor o = newObj.convertToEntity();
			o.setUserId(principal.getSubject());
			return new TutorResponse(facade.saveTutor(o));
		} catch(DuplicateAccountException ex){
			throw ex;
		}
	}
	
	@GetMapping("tutor/{id}")
	public TutorResponse getTutorById(@PathVariable Long id) {
		try {
			return new TutorResponse(facade.findTutorById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
		
	}
	
	@GetMapping("tutor/animal/{id}")
	public TutorResponse getTutorByAnimalId(@PathVariable Long id) {
		try {
			return new TutorResponse(facade.findTutorByanimalId(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
		
	}
	
	@PatchMapping("tutor/{id}")
	public TutorResponse updateTutor(@PathVariable Long id, @Valid @RequestBody TutorRequest obj) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Tutor o = obj.convertToEntity();
			Tutor oldObject = facade.findTutorById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
			}
		
			TypeMap<Tutor, Tutor> typeMapper = modelMapper
													.typeMap(Tutor.class, Tutor.class)
													.addMappings(mapper -> mapper.skip(Tutor::setId));			
			
			
			typeMapper.map(o, oldObject);	
			return new TutorResponse(facade.updateTutor(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("tutor/{id}")
	public String deleteTutor(@PathVariable Long id) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Tutor oldObject = facade.findTutorById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
			}
			facade.deleteTutor(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
