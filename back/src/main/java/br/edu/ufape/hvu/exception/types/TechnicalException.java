package br.edu.ufape.hvu.exception.types;

import br.edu.ufape.hvu.exception.types.global.ExceptionCustomized;

@SuppressWarnings("serial")
public class TechnicalException extends ExceptionCustomized{
    public TechnicalException(String code, String message) {
        super(code, message);
    }
}
