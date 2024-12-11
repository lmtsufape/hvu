package br.edu.ufape.hvu.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;

import br.edu.ufape.hvu.model.Ficha;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.controller.dto.request.FichaRequest;
import br.edu.ufape.hvu.controller.dto.response.FichaResponse;
import br.edu.ufape.hvu.exception.IdNotFoundException;



@RestController
@RequestMapping("/api/v1")
public class FichaController {
    @Autowired
    private Facade facade;
    @Autowired
    private ModelMapper modelMapper;


    @GetMapping("ficha")
    public List<FichaResponse> getAllFicha() {
        return facade.getAllFicha()
                .stream()
                .map(FichaResponse::new)
                .toList();
    }


    @PostMapping("ficha")
    public FichaResponse createFicha(@Valid @RequestBody FichaRequest newObj) {
        return new FichaResponse(facade.saveFicha(newObj.convertToEntity()));
    }


    @GetMapping("ficha/{id}")
    public FichaResponse getFichaById(@PathVariable Long id) {
        try {
            return new FichaResponse(facade.findFichaById(id));
        } catch (IdNotFoundException ex) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }


    @PatchMapping("ficha/{id}")
    public FichaResponse updateFicha(@PathVariable Long id, @Valid @RequestBody FichaRequest obj) {
        try {
            //Ficha o = obj.convertToEntity();
            Ficha oldObject = facade.findFichaById(id);

            TypeMap<FichaRequest, Ficha> typeMapper = modelMapper
                    .typeMap(FichaRequest.class, Ficha.class)
                    .addMappings(mapper -> mapper.skip(Ficha::setId));


            typeMapper.map(obj, oldObject);
            return new FichaResponse(facade.updateFicha(oldObject));
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }

    }


    @DeleteMapping("ficha/{id}")
    public String deleteFicha(@PathVariable Long id) {
        try {
            facade.deleteFicha(id);
            return "";
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        }

    }


}
