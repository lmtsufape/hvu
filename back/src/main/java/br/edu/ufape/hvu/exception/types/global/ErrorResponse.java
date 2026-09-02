package br.edu.ufape.hvu.exception.types.global;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter @NoArgsConstructor
public class ErrorResponse {
    private String error;
    private String message;
    private List<String> stackTrace; //Descomentar quando for preciso Stacktrace
    private LocalDateTime timestamp;

    public ErrorResponse(String exceptionType, String message, List<String> stackTrace, LocalDateTime timestamp) {
        this.error = exceptionType;
        this.message = message;
        this.stackTrace = stackTrace;
        this.timestamp = timestamp;
    }
}
