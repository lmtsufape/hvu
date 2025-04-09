package br.edu.ufape.hvu.config;

import br.edu.ufape.hvu.exception.ResourceNotFoundException;
import br.edu.ufape.hvu.exception.types.NotFoundException;
import br.edu.ufape.hvu.exception.types.auth.KeycloakAuthenticationException;
import br.edu.ufape.hvu.exception.types.global.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        logger.error("Erro inesperado: ", ex); // log completo no servidor

        ErrorResponse errorResponse = new ErrorResponse(
                "Erro interno",
                "Ocorreu um erro inesperado. Tente novamente mais tarde.",
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(KeycloakAuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleKeycloakAuthenticationException(KeycloakAuthenticationException ex) {
        logger.warn("Falha de autenticação no Keycloak: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "Falha de autenticação",
                ex.getMessage(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        logger.warn("Recurso não encontrado: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "Recurso não encontrado",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(NotFoundException ex) {
        logger.warn("Recurso não encontrado : {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                "Recurso não encontrado",
                ex.getMessage(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        logger.warn("Argumento inválido: {}", ex.getMessage());
        ErrorResponse error = new ErrorResponse(
                "Argumento inválido",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        logger.error("Erro inesperado: ", ex); // stacktrace incluso
        ErrorResponse error = new ErrorResponse(
                ex.getClass().getSimpleName(),
                "Erro inesperado: " + ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // mensagens mais pratricas para validações @Valid no DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .findFirst()
                .orElse("Erro de validação.");

        logger.warn("Erro de validação: {}", errorMessage);

        ErrorResponse error = new ErrorResponse(
                "Erro de validação",
                errorMessage,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
