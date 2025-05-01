package br.edu.ufape.hvu.config;

import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.ResourceNotFoundException;
import br.edu.ufape.hvu.exception.types.NotFoundException;
import br.edu.ufape.hvu.exception.types.auth.ForbiddenOperationException;
import br.edu.ufape.hvu.exception.types.auth.KeycloakAuthenticationException;
import br.edu.ufape.hvu.exception.types.global.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(KeycloakAuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleKeycloakAuthenticationException(KeycloakAuthenticationException ex) {
        logger.warn("Falha de autenticação no Keycloak: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "Falha de autenticação",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
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
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        logger.warn("Acesso negado: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "Acesso negado",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ForbiddenOperationException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenOperationException ex) {
        logger.warn("Operação proibida: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                "Acesso negado",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
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
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateAccountException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateAccount(DuplicateAccountException ex) {
        logger.warn("Recurso duplicado: {}", ex.getMessage());

        ErrorResponse error = new ErrorResponse(
                "Conflito de dados",
                ex.getMessage(),
                //Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }
}
