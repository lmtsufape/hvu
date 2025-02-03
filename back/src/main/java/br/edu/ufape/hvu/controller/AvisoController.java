package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.request.AvisoRequest;
import br.edu.ufape.hvu.controller.dto.response.AvisoResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.Aviso;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class AvisoController {
    @Autowired
    private Facade facade;
    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("aviso")
    public List<AvisoResponse> getAllAviso() {
        return facade.getAllAviso()
                .stream()
                .map(AvisoResponse::new)
                .toList();
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @PostMapping("aviso")
    public AvisoResponse createAviso(@Valid @RequestBody AvisoRequest newObj) {
        return new AvisoResponse(facade.saveAviso(newObj.convertToEntity()));
    }

    @GetMapping("aviso/{id}")
    public AvisoResponse getAvisoById(@PathVariable Long id) {
        try {
            return new AvisoResponse(facade.findAvisoById(id));
        } catch (IdNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }

    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @PatchMapping("aviso/{id}")
    public AvisoResponse updateAviso(@PathVariable Long id, @Valid @RequestBody AvisoRequest obj) {
        try {
            //Aviso o = obj.convertToEntity();
            Aviso oldObject = facade.findAvisoById(id);

            TypeMap<AvisoRequest, Aviso> typeMapper = modelMapper
                    .typeMap(AvisoRequest.class, Aviso.class)
                    .addMappings(mapper -> mapper.skip(Aviso::setId));


            typeMapper.map(obj, oldObject);
            return new AvisoResponse(facade.updateAviso(oldObject));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }
    }

    @PreAuthorize("hasRole('SECRETARIO')")
    @DeleteMapping("aviso/{id}")
    public String deleteAviso(@PathVariable Long id) {
        try {
            facade.deleteAviso(id);
            return "";
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }

    }
}
