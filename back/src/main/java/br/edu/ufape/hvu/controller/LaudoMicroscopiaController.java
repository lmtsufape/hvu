package br.edu.ufape.hvu.controller;


import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.LaudoMicroscopia;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.LaudoMicroscopiaRequest;
import br.edu.ufape.hvu.controller.dto.response.LaudoMicroscopiaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:8081/" )
@RestController
@RequestMapping("/api/v1/")
public class LaudoMicroscopiaController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("laudoMicroscopia")
	public List<LaudoMicroscopiaResponse> getAllLaudoMicroscopia() {
		return facade.getAllLaudoMicroscopia()
			.stream()
			.map(LaudoMicroscopiaResponse::new)
			.toList();
	}
	
	@PostMapping("laudoMicroscopia")
	public LaudoMicroscopiaResponse createLaudoMicroscopia(@Valid @RequestBody LaudoMicroscopiaRequest newObj) {
		return new LaudoMicroscopiaResponse(facade.saveLaudoMicroscopia(newObj.convertToEntity()));
	}
	
	@GetMapping("laudoMicroscopia/{id}")
	public LaudoMicroscopiaResponse getLaudoMicroscopiaById(@PathVariable Long id) {
		try {
			return new LaudoMicroscopiaResponse(facade.findLaudoMicroscopiaById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("laudoMicroscopia/{id}")
	public LaudoMicroscopiaResponse updateLaudoMicroscopia(@PathVariable Long id, @Valid @RequestBody LaudoMicroscopiaRequest obj) {
		try {
			//LaudoMicroscopia o = obj.convertToEntity();
			LaudoMicroscopia oldObject = facade.findLaudoMicroscopiaById(id);

			//fichaSolicitacaoServico

			if(obj.getFichaSolicitacaoServico() != null){
				oldObject.setFichaSolicitacaoServico(facade.findFichaSolicitacaoServicoById(obj.getFichaSolicitacaoServico().getId()));
				obj.setFichaSolicitacaoServico(null);
			}

			//campoLaudo
			if(obj.getCampoLaudo() != null){
				oldObject.setCampoLaudo(facade.findCampoLaudoById(obj.getCampoLaudo().getId()));
				obj.setCampoLaudo(null);
			}

			//etapa
			if(obj.getEtapa() != null){
				oldObject.setEtapa(facade.findEtapaById(obj.getEtapa().getId()));
				obj.setEtapa(null);
			}





			TypeMap<LaudoMicroscopiaRequest, LaudoMicroscopia> typeMapper = modelMapper
													.typeMap(LaudoMicroscopiaRequest.class, LaudoMicroscopia.class)
													.addMappings(mapper -> mapper.skip(LaudoMicroscopia::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new LaudoMicroscopiaResponse(facade.updateLaudoMicroscopia(oldObject));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("laudoMicroscopia/{id}")
	public String deleteLaudoMicroscopia(@PathVariable Long id) {
		try {
			facade.deleteLaudoMicroscopia(id);
			return "";
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
