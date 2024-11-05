package br.edu.ufape.hvu.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.UsuarioRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Usuario;

@Service
public class UsuarioService implements UsuarioServiceInterface {
	@Autowired
	private UsuarioRepository repository;


	public Usuario saveUsuario(Usuario newInstance) {
		return repository.save(newInstance);
	}

	public Usuario updateUsuario(Usuario transientObject, String idSession) {
		if(!transientObject.getUserId().equals(idSession)){
			throw new AccessDeniedException("This is not your account");
		}
		return repository.save(transientObject);
	}

	public Usuario findUsuarioById(long id, String idSession) {
		Usuario user = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Usuario"));

		if(!user.getUserId().equals(idSession)){
			throw new AccessDeniedException("This is not your account");
		}
		return user;
	}
	
	public Usuario findUsuarioByuserId(String userId) throws IdNotFoundException {
		Optional<Usuario> usuario = repository.findByuserId(userId);
		if(usuario.isEmpty()) {
			throw new IdNotFoundException(userId, "Usuario");
		}
		return usuario.get();
	}

	public List<Usuario> getAllUsuario(){
		return repository.findAll();
	}

	public void deleteUsuario( Usuario persistentObject){
		this.deleteUsuario(persistentObject.getId());
		
	}
	
	public void deleteUsuario(long id){
		Usuario obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Usuario"));
		repository.delete(obj);
	}	
	
	
	
}