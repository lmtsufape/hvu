package br.edu.ufape.hvu.model;

import jakarta.persistence.Entity;
import lombok.*;

@SuppressWarnings("serial")
@Entity
@Getter @Setter @NoArgsConstructor
@EqualsAndHashCode(callSuper=false)
@ToString
public class AdminLapa extends Usuario {

}
