package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Aviso;
import java.util.List;

public interface AvisoServiceInterface {
    List<Aviso> getAllAviso();
    List<Aviso> findAvisosHabilitados();
    Aviso saveAviso(Aviso o);
    Aviso findAvisoById(long id);
    Aviso updateAviso(Aviso u);
    void deleteAviso(long id);
}
