package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Usuario;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.UsuarioRequest;
import br.edu.ufape.hvu.controller.dto.response.UsuarioResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class UsuarioController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("usuario")
	public List<UsuarioResponse> getAllUsuario() {
		return facade.getAllUsuario()
			.stream()
			.map(UsuarioResponse::new)
			.toList();
	}
	
	@PostMapping("usuario")
	public UsuarioResponse createUsuario(@Valid @RequestBody UsuarioRequest newObj) {
		return new UsuarioResponse(facade.saveUsuario(newObj.convertToEntity()));
	}
	
	@GetMapping("usuario/{id}")
	public UsuarioResponse getUsuarioById(@PathVariable Long id) {
		try {
			return new UsuarioResponse(facade.findUsuarioById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("usuario/{id}")
	public UsuarioResponse updateUsuario(@PathVariable Long id, @Valid @RequestBody UsuarioRequest obj) {
		try {
			//Usuario o = obj.convertToEntity();
			Usuario oldObject = facade.findUsuarioById(id);

			TypeMap<UsuarioRequest, Usuario> typeMapper = modelMapper
													.typeMap(UsuarioRequest.class, Usuario.class)
													.addMappings(mapper -> mapper.skip(Usuario::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new UsuarioResponse(facade.updateUsuario(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("usuario/{id}")
	public String deleteUsuario(@PathVariable Long id) {
		try {
			facade.deleteUsuario(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
