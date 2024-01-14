package br.edu.ufape.hvu.exception;

import br.edu.ufape.hvu.exception.types.NotFoundException;

@SuppressWarnings("serial")
public class ObjectNotFoundException extends NotFoundException {

	public ObjectNotFoundException(String Classe) {
		super("003", ("Objeto da Classe " +Classe + " não encontrado"));
	}

}
