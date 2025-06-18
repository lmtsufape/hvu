package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Patologista;

import java.util.List;

public interface PatologistaServiceInterface {
    Patologista savePatologista(Patologista o);
    Patologista findPatologistaById(long id);
    Patologista updatePatologista(Patologista u);
    void deletePatologista(long id);
    List<Patologista> getAllPatologista();
}
