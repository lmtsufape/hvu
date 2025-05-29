package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.request.CampoLaudoMicroscopiaRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoMicroscopiaResponse;
import br.edu.ufape.hvu.facade.Facade;
import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/")
public class CampoLaudoMicroscopiaController {

    @Autowired
    private Facade facade;

    @Autowired
    private ModelMapper modelMapper;

    @PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
    @GetMapping("campoLaudoMicroscopia")
    public List<CampoLaudoMicroscopiaResponse> getAllCampoLaudoMicroscopia() {
        return facade.getAllCampoLaudoMicroscopia()
                .stream()
                .map(CampoLaudoMicroscopiaResponse::new)
                .toList();
    }

    @PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
    @PostMapping("campoLaudoMicroscopia")
    public CampoLaudoMicroscopiaResponse createCampoLaudoMicroscopia(@Valid @RequestBody CampoLaudoMicroscopiaRequest newObj) {
        return new CampoLaudoMicroscopiaResponse(facade.saveCampoLaudoMicroscopia(newObj.convertToEntity()));
    }

    @PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
    @GetMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse getCampoLaudoMicroscopiaById(@PathVariable Long id) {
        return new CampoLaudoMicroscopiaResponse(facade.findCampoLaudoMicroscopiaById(id));
    }

    @PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
    @PatchMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse updateCampoLaudoMicroscopia(@PathVariable Long id, @Valid @RequestBody CampoLaudoMicroscopiaRequest obj) {
        CampoLaudoMicroscopia oldObject = facade.findCampoLaudoMicroscopiaById(id);

        TypeMap<CampoLaudoMicroscopiaRequest, CampoLaudoMicroscopia> typeMapper = modelMapper
                    .typeMap(CampoLaudoMicroscopiaRequest.class, CampoLaudoMicroscopia.class)
                    .addMappings(mapper -> mapper.skip(CampoLaudoMicroscopia::setId));

        typeMapper.map(obj, oldObject);
        return new CampoLaudoMicroscopiaResponse(facade.updateCampoLaudoMicroscopia(oldObject));

    }

    @PreAuthorize("hasAnyRole('MEDICOLAPA', 'SECRETARIOLAPA')")
    @DeleteMapping("campoLaudoMicroscopia/{id}")
    public String deleteCampoLaudoMicroscopia(@PathVariable Long id) {
        facade.deleteCampoLaudoMicroscopia(id);
        return "";
    }
}
