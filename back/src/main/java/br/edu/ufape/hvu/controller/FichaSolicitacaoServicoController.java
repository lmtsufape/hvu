package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.FichaSolicitacaoServico;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FichaSolicitacaoServicoRequest;
import br.edu.ufape.hvu.controller.dto.response.FichaSolicitacaoServicoResponse;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class FichaSolicitacaoServicoController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("fichaSolicitacaoServico")
	public List<FichaSolicitacaoServicoResponse> getAllFichaSolicitacaoServico() {
		return facade.getAllFichaSolicitacaoServico()
			.stream()
			.map(FichaSolicitacaoServicoResponse::new)
			.toList();
	}
	
	@PostMapping("fichaSolicitacaoServico")
	public FichaSolicitacaoServicoResponse createFichaSolicitacaoServico(@Valid @RequestBody FichaSolicitacaoServicoRequest newObj) {
		return new FichaSolicitacaoServicoResponse(facade.saveFichaSolicitacaoServico(newObj.convertToEntity()));
	}
	
	@GetMapping("fichaSolicitacaoServico/{id}")
	public FichaSolicitacaoServicoResponse getFichaSolicitacaoServicoById(@PathVariable Long id) {
		try {
			return new FichaSolicitacaoServicoResponse(facade.findFichaSolicitacaoServicoById(id));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, "FichaSolicitacaoServico " + id + " not found.");
		}
	}
	
	@PatchMapping("fichaSolicitacaoServico/{id}")
	public FichaSolicitacaoServicoResponse updateFichaSolicitacaoServico(@PathVariable Long id, @Valid @RequestBody FichaSolicitacaoServicoRequest obj) {
		try {
			//FichaSolicitacaoServico o = obj.convertToEntity();
			FichaSolicitacaoServico oldObject = facade.findFichaSolicitacaoServicoById(id);

			TypeMap<FichaSolicitacaoServicoRequest, FichaSolicitacaoServico> typeMapper = modelMapper
													.typeMap(FichaSolicitacaoServicoRequest.class, FichaSolicitacaoServico.class)
													.addMappings(mapper -> mapper.skip(FichaSolicitacaoServico::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new FichaSolicitacaoServicoResponse(facade.updateFichaSolicitacaoServico(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("fichaSolicitacaoServico/{id}")
	public String deleteFichaSolicitacaoServico(@PathVariable Long id) {
		try {
			facade.deleteFichaSolicitacaoServico(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
