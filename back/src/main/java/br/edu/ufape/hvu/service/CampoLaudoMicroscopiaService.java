package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.CampoLaudoMicroscopia;
import br.edu.ufape.hvu.repository.CampoLaudoMicroscopiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CampoLaudoMicroscopiaService implements CampoLaudoMicroscopiaServiceInterface {

    @Autowired
    private CampoLaudoMicroscopiaRepository repository;

    @Override
    public CampoLaudoMicroscopia saveCampoLaudoMicroscopia(CampoLaudoMicroscopia newInstance) {
        return repository.save(newInstance);
    }

    @Override
    public CampoLaudoMicroscopia updateCampoLaudoMicroscopia(CampoLaudoMicroscopia transientObject) {
        return repository.save(transientObject);
    }

    @Override
    public CampoLaudoMicroscopia findCampoLaudoMicroscopiaById(Long id) {
        return repository.findById(id).orElseThrow(() -> new IdNotFoundException(id, "CampoLaudoMicroscopia"));
    }

    @Override
    public List<CampoLaudoMicroscopia> getAllCampoLaudoMicroscopia() {
        return repository.findAll();
    }

    @Override
    public void deleteCampoLaudoMicroscopia(CampoLaudoMicroscopia persistentObject) {
        this.deleteCampoLaudoMicroscopia(persistentObject.getId());
    }

    @Override
    public void deleteCampoLaudoMicroscopia(Long id) {
        CampoLaudoMicroscopia obj = repository.findById(id).orElseThrow(() -> new IdNotFoundException(id, "CampoLaudoMicroscopia"));
        repository.delete(obj);
    }
}
