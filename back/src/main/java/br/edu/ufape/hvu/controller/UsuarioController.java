package br.edu.ufape.hvu.controller;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotNull;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;
import com.nimbusds.jose.shaded.gson.internal.LinkedTreeMap;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Usuario;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.UsuarioRequest;
import br.edu.ufape.hvu.controller.dto.response.UsuarioResponse;
import br.edu.ufape.hvu.controller.dto.response.UsuarioCurrentResponse;

import br.edu.ufape.hvu.exception.IdNotFoundException;


 
@RestController
@RequestMapping("/api/v1/")
public class UsuarioController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;

	@PreAuthorize("hasRole('SECRETARIO')")
	@GetMapping("usuario")
	public List<UsuarioResponse> getAllUsuario() {
		return facade.getAllUsuario()
			.stream()
			.map(UsuarioResponse::new)
			.toList();
	}
	
	@PostMapping("usuario")
	public UsuarioResponse createUsuario(@RequestBody @Valid UsuarioRequest newObj) {
		return new UsuarioResponse(facade.saveUsuario(newObj.convertToEntity()));
	}
	
	@GetMapping("usuario/{id}")
	public UsuarioResponse getUsuarioById(@PathVariable @NotNull Long id) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		return new UsuarioResponse(facade.findUsuarioById(id, principal.getSubject()));
	}
	
	@GetMapping("usuario/current")
	public UsuarioCurrentResponse getCurrentUsuario() {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();
		LinkedTreeMap<String,ArrayList<String>> tree = principal.getClaim("realm_access");
		ArrayList<String> roles = tree.get("roles");
			
		return new UsuarioCurrentResponse(new UsuarioResponse( facade.findUsuarioByuserId(principal.getSubject())),roles);
	}

	@PreAuthorize("hasAnyRole('SECRETARIO', 'MEDICO', 'TUTOR')")
	@PatchMapping("usuario/{id}")
	public UsuarioResponse updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequest obj) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		Jwt principal = (Jwt) authentication.getPrincipal();

		//Usuario o = obj.convertToEntity();
		Usuario oldObject = facade.findUsuarioById(id, principal.getSubject());

		TypeMap<UsuarioRequest, Usuario> typeMapper = modelMapper
				.typeMap(UsuarioRequest.class, Usuario.class)
				.addMappings(mapper -> mapper.skip(Usuario::setId));
			
			
		typeMapper.map(obj, oldObject);
		return new UsuarioResponse(facade.updateUsuario(oldObject, principal.getSubject()));
	}

	@DeleteMapping("usuario/{id}")
	public String deleteUsuario(@PathVariable Long id) {
		facade.deleteUsuario(id);
		return "";
	}

}
