package br.edu.ufape.hvu.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Table(name = "fotos")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor 
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString
public class Foto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private long id;

    @Column(nullable = false, unique = true)
    private String nomeArquivo;

    private String titulo;

    @Column(nullable = false)
    private String caminhoRelativo;

    @Column(nullable = false)
    private String tipoArquivo;

    @Column(nullable = false)
    private LocalDateTime dataUpload;
}
