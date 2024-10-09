package br.edu.ufape.hvu.exception.types.global;

import br.edu.ufape.hvu.exception.types.auth.KeycloakAuthenticationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import br.edu.ufape.hvu.exception.types.BusinessException;
import br.edu.ufape.hvu.exception.types.NotFoundException;
import br.edu.ufape.hvu.exception.types.TechnicalException;

@ControllerAdvice
public class GlobalExceptionHandling extends ResponseEntityExceptionHandler {

    @SuppressWarnings({ "rawtypes", "unchecked" })
	@ExceptionHandler(ExceptionCustomized.class)
    public final ResponseEntity<Object> expectionHandling(Exception ex) {
        int statusCode = 0;

        if (ex instanceof BusinessException)
            statusCode = HttpStatus.UNPROCESSABLE_ENTITY.value();
        else if(ex instanceof NotFoundException)
            statusCode = HttpStatus.NOT_FOUND.value();
        else if(ex instanceof TechnicalException)
            statusCode = 512;
        else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
            return new ResponseEntity(new ErrorResponse(String.valueOf(statusCode), "An unexpected error has occurred"), HttpStatus.valueOf(statusCode));
        }

        return new ResponseEntity<>(new ErrorResponse(((ExceptionCustomized) ex).getCode(), ex.getMessage()), HttpStatus.valueOf(statusCode));
    }

    @ExceptionHandler(KeycloakAuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleKeycloakAuthenticationException(KeycloakAuthenticationException ex) {
        ErrorResponse errorResponse = new ErrorResponse(ex.getMessage(), String.valueOf(HttpStatus.UNAUTHORIZED.value()));
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
}
