package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.EnderecoRequest;
import br.edu.ufape.hvu.controller.dto.response.EnderecoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class EnderecoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("endereco")
	public List<EnderecoResponse> getAllEndereco() {
		return facade.getAllEndereco()
			.stream()
			.map(EnderecoResponse::new)
			.toList();
	}
	
	@PostMapping("endereco")
	public EnderecoResponse createEndereco(@Valid @RequestBody EnderecoRequest newObj) {
		return new EnderecoResponse(facade.saveEndereco(newObj.convertToEntity()));
	}
	
	@GetMapping("endereco/{id}")
	public EnderecoResponse getEnderecoById(@PathVariable Long id) {
		try {
			return new EnderecoResponse(facade.findEnderecoById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("endereco/{id}")
	public EnderecoResponse updateEndereco(@PathVariable Long id, @Valid @RequestBody EnderecoRequest obj) {
		try {
			//Endereco o = obj.convertToEntity();
			Endereco oldObject = facade.findEnderecoById(id);

			TypeMap<EnderecoRequest, Endereco> typeMapper = modelMapper
													.typeMap(EnderecoRequest.class, Endereco.class)
													.addMappings(mapper -> mapper.skip(Endereco::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new EnderecoResponse(facade.updateEndereco(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("endereco/{id}")
	public String deleteEndereco(@PathVariable Long id) {
		try {
			facade.deleteEndereco(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
