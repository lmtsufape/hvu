package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.LivroRegistro;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LivroRegistroRequest;
import br.edu.ufape.hvu.controller.dto.response.LivroRegistroResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class LivroRegistroController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("livroRegistro")
	public List<LivroRegistroResponse> getAllLivroRegistro() {
		return facade.getAllLivroRegistro()
			.stream()
			.map(LivroRegistroResponse::new)
			.toList();
	}
	
	@PostMapping("livroRegistro")
	public LivroRegistroResponse createLivroRegistro(@Valid @RequestBody LivroRegistroRequest newObj) {
		return new LivroRegistroResponse(facade.saveLivroRegistro(newObj.convertToEntity()));
	}
	
	@GetMapping("livroRegistro/{id}")
	public LivroRegistroResponse getLivroRegistroById(@PathVariable Long id) {
		try {
			return new LivroRegistroResponse(facade.findLivroRegistroById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("livroRegistro/{id}")
	public LivroRegistroResponse updateLivroRegistro(@PathVariable Long id, @Valid @RequestBody LivroRegistroRequest obj) {
		try {
			//LivroRegistro o = obj.convertToEntity();
			LivroRegistro oldObject = facade.findLivroRegistroById(id);

			if(obj.getMedico() != null){
				oldObject.setMedico(facade.findMedicoById(obj.getMedico().getId()));
				obj.setMedico(null);
			}

			TypeMap<LivroRegistroRequest, LivroRegistro> typeMapper = modelMapper
													.typeMap(LivroRegistroRequest.class, LivroRegistro.class)
													.addMappings(mapper -> mapper.skip(LivroRegistro::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new LivroRegistroResponse(facade.updateLivroRegistro(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("livroRegistro/{id}")
	public String deleteLivroRegistro(@PathVariable Long id) {
		try {
			facade.deleteLivroRegistro(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
