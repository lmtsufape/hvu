package br.edu.ufape.hvu.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s com %s '%s' não foi encontrado.", resource, field, value));
    }
}
