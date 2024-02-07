package br.edu.ufape.hvu.exception;

@SuppressWarnings("serial")
public class AssociationConflictException extends RuntimeException {

	public AssociationConflictException(String msg) {
		super(msg);
	}

	public AssociationConflictException() {
		super("Erro! Relacionamento em conflito");
	}

}
