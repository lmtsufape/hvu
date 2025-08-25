package br.edu.ufape.hvu.controller;

import br.edu.ufape.hvu.controller.dto.request.CampoLaudoMicroscopiaRequest;
import br.edu.ufape.hvu.controller.dto.response.CampoLaudoMicroscopiaResponse;
import br.edu.ufape.hvu.facade.Facade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/")
@RequiredArgsConstructor
public class CampoLaudoMicroscopiaController {
    private final Facade facade;

    @PreAuthorize("hasRole('PATOLOGISTA')")
    @GetMapping("campoLaudoMicroscopia")
    public List<CampoLaudoMicroscopiaResponse> getAllCampoLaudoMicroscopia() {
        return facade.getAllCampoLaudoMicroscopia()
                .stream()
                .map(CampoLaudoMicroscopiaResponse::new)
                .toList();
    }

    @PreAuthorize("hasRole('PATOLOGISTA')")
    @PostMapping("campoLaudoMicroscopia")
    public CampoLaudoMicroscopiaResponse createCampoLaudoMicroscopia(@Valid @RequestBody CampoLaudoMicroscopiaRequest newObj) {
        return new CampoLaudoMicroscopiaResponse(facade.saveCampoLaudoMicroscopia(newObj.convertToEntity()));
    }

    @PreAuthorize("hasRole('PATOLOGISTA')")
    @GetMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse getCampoLaudoMicroscopiaById(@PathVariable Long id) {
        return new CampoLaudoMicroscopiaResponse(facade.findCampoLaudoMicroscopiaById(id));
    }

    @PreAuthorize("hasRole('PATOLOGISTA')")
    @PatchMapping("campoLaudoMicroscopia/{id}")
    public CampoLaudoMicroscopiaResponse updateCampoLaudoMicroscopia(@PathVariable Long id, @Valid @RequestBody CampoLaudoMicroscopiaRequest obj) {
        return new CampoLaudoMicroscopiaResponse(facade.updateCampoLaudoMicroscopia(obj, id));
    }

    @PreAuthorize("hasRole('PATOLOGISTA')")
    @DeleteMapping("campoLaudoMicroscopia/{id}")
    public String deleteCampoLaudoMicroscopia(@PathVariable Long id) {
        facade.deleteCampoLaudoMicroscopia(id);
        return "";
    }

}
