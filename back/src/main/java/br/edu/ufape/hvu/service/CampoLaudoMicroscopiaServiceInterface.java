package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import java.util.List;

public interface CampoLaudoMicroscopiaServiceInterface {
    CampoLaudoMicroscopia saveCampoLaudoMicroscopia(CampoLaudoMicroscopia newInstance);
    CampoLaudoMicroscopia updateCampoLaudoMicroscopia(CampoLaudoMicroscopia transientObject);
    CampoLaudoMicroscopia findCampoLaudoMicroscopiaById(Long id);
    List<CampoLaudoMicroscopia> getAllCampoLaudoMicroscopia();
    void deleteCampoLaudoMicroscopia(CampoLaudoMicroscopia persistentObject);
    void deleteCampoLaudoMicroscopia(Long id);
}
