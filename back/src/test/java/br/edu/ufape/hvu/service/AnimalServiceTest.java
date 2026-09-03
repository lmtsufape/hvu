package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.repository.AnimalRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnimalServiceTest {

    @Mock
    private AnimalRepository animalRepository;

    @InjectMocks
    private AnimalService animalService;

    @Test
    void deveRetornarAnimalQuandoExistir() {
        Animal animal = new Animal();
        animal.setId(1L);
        animal.setNome("Rex");

        when(animalRepository.findById(1L)).thenReturn(Optional.of(animal));

        Animal resultado = animalService.findAnimalById(1L);

        assertThat(resultado).isNotNull();
        assertThat(resultado.getId()).isEqualTo(1L);
        assertThat(resultado.getNome()).isEqualTo("Rex");
        verify(animalRepository).findById(1L);
    }

    @Test
    void deveLancarIdNotFoundExceptionQuandoNaoExistir() {
        when(animalRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> animalService.findAnimalById(99L))
                .isInstanceOf(IdNotFoundException.class);
    }
}
