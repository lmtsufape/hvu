package br.edu.ufape.hvu.controller.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EmailRequest {
    private String email;

    public String convertToString() {
        return this.email;
    }
}
