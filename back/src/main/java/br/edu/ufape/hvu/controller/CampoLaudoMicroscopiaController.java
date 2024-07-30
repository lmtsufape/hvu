package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.request.CampoLaudoMicroscopiaRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoMicroscopiaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class CampoLaudoMicroscopiaController {

    @Autowired
    private Facade facade;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("campoLaudoMicroscopia")
    public List<CampoLaudoMicroscopiaResponse> getAllCampoLaudoMicroscopia() {
        return facade.getAllCampoLaudoMicroscopia()
                .stream()
                .map(CampoLaudoMicroscopiaResponse::new)
                .toList();
    }

    @PostMapping("campoLaudoMicroscopia")
    public CampoLaudoMicroscopiaResponse createCampoLaudoMicroscopia(@Valid @RequestBody CampoLaudoMicroscopiaRequest newObj) {
        return new CampoLaudoMicroscopiaResponse(facade.saveCampoLaudoMicroscopia(newObj.convertToEntity()));
    }

    @GetMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse getCampoLaudoMicroscopiaById(@PathVariable Long id) {
        try {
            return new CampoLaudoMicroscopiaResponse(facade.findCampoLaudoMicroscopiaById(id));
        } catch (IdNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @PatchMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse updateCampoLaudoMicroscopia(@PathVariable Long id, @Valid @RequestBody CampoLaudoMicroscopiaRequest obj) {
        try {
            CampoLaudoMicroscopia oldObject = facade.findCampoLaudoMicroscopiaById(id);

            TypeMap<CampoLaudoMicroscopiaRequest, CampoLaudoMicroscopia> typeMapper = modelMapper
                    .typeMap(CampoLaudoMicroscopiaRequest.class, CampoLaudoMicroscopia.class)
                    .addMappings(mapper -> mapper.skip(CampoLaudoMicroscopia::setId));

            typeMapper.map(obj, oldObject);
            return new CampoLaudoMicroscopiaResponse(facade.updateCampoLaudoMicroscopia(oldObject));
        } catch (IdNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    @DeleteMapping("campoLaudoMicroscopia/{id}")
    public String deleteCampoLaudoMicroscopia(@PathVariable Long id) {
        try {
            facade.deleteCampoLaudoMicroscopia(id);
            return "";
        } catch (IdNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }
}
