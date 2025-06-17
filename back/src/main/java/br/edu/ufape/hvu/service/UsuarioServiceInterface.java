package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Usuario;

public interface UsuarioServiceInterface {
	Usuario saveUsuario(Usuario o);
	Usuario findUsuarioById(long id, String idSession);
	Usuario updateUsuario(Usuario u, String idSession);
	void deleteUsuario(long id);
	List<Usuario> getAllUsuario();
	Usuario findUsuarioByuserId(String userId);
    
    

    
}