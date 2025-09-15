package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Usuario;

public interface UsuarioServiceInterface {
	Usuario saveUsuario(Usuario o);
	Usuario findUsuarioById(long id);
	Usuario updateUsuario(Usuario u, String idSession);
	void deleteUsuario(long id);
	Usuario findUsuarioByUserId(String userId);
}