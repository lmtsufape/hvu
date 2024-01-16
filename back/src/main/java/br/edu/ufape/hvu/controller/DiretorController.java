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

import br.edu.ufape.hvu.model.Diretor;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.DiretorRequest;
import br.edu.ufape.hvu.controller.dto.response.DiretorResponse;
import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class DiretorController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("diretor")
	public List<DiretorResponse> getAllDiretor() {
		return facade.getAllDiretor()
			.stream()
			.map(DiretorResponse::new)
			.toList();
	}
	
	@PostMapping("diretor")
	public DiretorResponse createDiretor(@Valid @RequestBody DiretorRequest newObj) {
		try{
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			facade.findDuplicateAccountByuserId(principal.getSubject());
			Diretor o = newObj.convertToEntity();
			o.setUserId(principal.getSubject());
			return new DiretorResponse(facade.saveDiretor(o));
		} catch(DuplicateAccountException ex){
			throw ex;
		}
		
	}
	
	@GetMapping("diretor/{id}")
	public DiretorResponse getDiretorById(@PathVariable Long id) {
		try {
			return new DiretorResponse(facade.findDiretorById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("diretor/{id}")
	public DiretorResponse updateDiretor(@PathVariable Long id, @Valid @RequestBody DiretorRequest obj) {
		try {
			//Diretor o = obj.convertToEntity();
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Diretor o = obj.convertToEntity();
			Diretor oldObject = facade.findDiretorById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
			}
		
			TypeMap<Diretor, Diretor> typeMapper = modelMapper
													.typeMap(Diretor.class, Diretor.class)
													.addMappings(mapper -> mapper.skip(Diretor::setId));			
			
			
			
			typeMapper.map(o, oldObject);	
			return new DiretorResponse(facade.updateDiretor(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("diretor/{id}")
	public String deleteDiretor(@PathVariable Long id) {
		try {
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
			Jwt principal = (Jwt) authentication.getPrincipal();
			
			Diretor oldObject = facade.findDiretorById(id);
			
			if(!principal.getSubject().equals(oldObject.getUserId())) {
				throw new AccessDeniedException("This is not your account");
			}
			facade.deleteDiretor(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
