package br.edu.ufape.hvu.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.UsuarioRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Usuario;

@Service
@RequiredArgsConstructor
public class UsuarioService implements UsuarioServiceInterface {
	private final UsuarioRepository repository;

	public Usuario saveUsuario(Usuario newInstance) {
		return repository.save(newInstance);
	}

	public Usuario updateUsuario(Usuario transientObject, String idSession) {
		return repository.save(transientObject);
	}

	public Usuario findUsuarioById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Usuario"));
	}
	
	public Usuario findUsuarioByUserId(String userId) throws IdNotFoundException {
		return repository.findByUserId(userId).orElseThrow(() -> new IdNotFoundException(userId, "Usuario"));
	}

	public void deleteUsuario(long id){
		Usuario obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Usuario"));
		repository.delete(obj);
	}

}