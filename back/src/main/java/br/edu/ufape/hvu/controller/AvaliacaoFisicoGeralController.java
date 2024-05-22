package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.AvaliacaoFisicoGeral;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.AvaliacaoFisicoGeralRequest;
import br.edu.ufape.hvu.controller.dto.response.AvaliacaoFisicoGeralResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;


@CrossOrigin (origins = "http://localhost:3000/" )
@RestController
@RequestMapping("/api/v1/")
public class AvaliacaoFisicoGeralController {
	@Autowired
	private Facade facade;
	@Autowired
	private ModelMapper modelMapper;
	
	@GetMapping("avaliacaoFisicoGeral")
	public List<AvaliacaoFisicoGeralResponse> getAllAvaliacaoFisicoGeral() {
		return facade.getAllAvaliacaoFisicoGeral()
			.stream()
			.map(AvaliacaoFisicoGeralResponse::new)
			.toList();
	}
	
	@PostMapping("avaliacaoFisicoGeral")
	public AvaliacaoFisicoGeralResponse createAvaliacaoFisicoGeral(@Valid @RequestBody AvaliacaoFisicoGeralRequest newObj) {
		return new AvaliacaoFisicoGeralResponse(facade.saveAvaliacaoFisicoGeral(newObj.convertToEntity()));
	}
	
	@GetMapping("avaliacaoFisicoGeral/{id}")
	public AvaliacaoFisicoGeralResponse getAvaliacaoFisicoGeralById(@PathVariable Long id) {
		try {
			return new AvaliacaoFisicoGeralResponse(facade.findAvaliacaoFisicoGeralById(id));
		} catch (IdNotFoundException ex) {
			throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
		}
	}
	
	@PatchMapping("avaliacaoFisicoGeral/{id}")
	public AvaliacaoFisicoGeralResponse updateAvaliacaoFisicoGeral(@PathVariable Long id, @Valid @RequestBody AvaliacaoFisicoGeralRequest obj) {
		try {
			//AvaliacaoFisicoGeral o = obj.convertToEntity();
			AvaliacaoFisicoGeral oldObject = facade.findAvaliacaoFisicoGeralById(id);

			//tipoPostura
			if(obj.getTipoPostura() != null){
				oldObject.setTipoPostura(facade.findTipoPosturaById(obj.getTipoPostura().getId()));
				obj.setTipoPostura(null);
			}

			//scoreCorporal
			if(obj.getScoreCorporal() != null){
				oldObject.setScoreCorporal(facade.findScoreCorporalById(obj.getScoreCorporal().getId()));
				obj.setScoreCorporal(null);
			}

			//tipoLinfonodos
			if(obj.getTipoLinfonodos() != null){
				oldObject.setTipoLinfonodos(facade.findTipoLinfonodosById(obj.getTipoLinfonodos().getId()));
				obj.setTipoLinfonodos(null);
			}

			//nivelHidratacao
			if(obj.getNivelHidratacao() != null){
				oldObject.setNivelHidratacao(facade.findNivelHidratacaoById(obj.getNivelHidratacao().getId()));
				obj.setNivelHidratacao(null);
			}

			//tipoTurgorCutaneo
			if(obj.getTipoTurgorCutaneo() != null){
				oldObject.setTipoTurgorCutaneo(facade.findTipoTurgorCutaneoById(obj.getTipoTurgorCutaneo().getId()));
				obj.setTipoTurgorCutaneo(null);
			}

			// nivelConsciencia
			if(obj.getNivelConsciencia() != null){
				oldObject.setNivelConsciencia(facade.findNivelConscienciaById(obj.getNivelConsciencia().getId()));
				obj.setNivelConsciencia(null);
			}

			// tipoMucosa
			if(obj.getTipoMucosa() != null){
				oldObject.setTipoMucosa(facade.findTipoMucosaById(obj.getTipoMucosa().getId()));
				obj.setTipoMucosa(null);
			}

			TypeMap<AvaliacaoFisicoGeralRequest, AvaliacaoFisicoGeral> typeMapper = modelMapper
													.typeMap(AvaliacaoFisicoGeralRequest.class, AvaliacaoFisicoGeral.class)
													.addMappings(mapper -> mapper.skip(AvaliacaoFisicoGeral::setId));			
			
			
			typeMapper.map(obj, oldObject);	
			return new AvaliacaoFisicoGeralResponse(facade.updateAvaliacaoFisicoGeral(oldObject));
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	
	@DeleteMapping("avaliacaoFisicoGeral/{id}")
	public String deleteAvaliacaoFisicoGeral(@PathVariable Long id) {
		try {
			facade.deleteAvaliacaoFisicoGeral(id);
			return "";
		} catch (RuntimeException ex) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
		}
		
	}
	

}
