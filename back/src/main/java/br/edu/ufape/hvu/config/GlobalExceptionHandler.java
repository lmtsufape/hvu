package br.edu.ufape.hvu.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getClass().getSimpleName(),
                ex.getMessage(),
                Arrays.asList(ex.getStackTrace()),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static class ErrorResponse {
        private String exceptionType;
        private String message;
        private List<StackTraceElement> stackTrace;
        private LocalDateTime timestamp;

        public ErrorResponse(String exceptionType, String message, List<StackTraceElement> stackTrace, LocalDateTime timestamp) {
            this.exceptionType = exceptionType;
            this.message = message;
            this.stackTrace = stackTrace;
            this.timestamp = timestamp;
        }

        public String getExceptionType() { return exceptionType; }
        public String getMessage() { return message; }
        public List<StackTraceElement> getStackTrace() { return stackTrace; }
        public LocalDateTime getTimestamp() { return timestamp; }
    }
}
