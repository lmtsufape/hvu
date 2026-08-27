package br.edu.ufape.hvu.mapper;

import org.springframework.stereotype.Component;
import br.edu.ufape.hvu.controller.dto.request.AnimalRequestFix;
import br.edu.ufape.hvu.controller.dto.response.AnimalResponseFix;
import br.edu.ufape.hvu.controller.dto.response.RacaResponseFix;
import br.edu.ufape.hvu.model.Animal;
import java.util.List;

@Component
public class AnimalMapper {

    public Animal toEntity(AnimalRequestFix request) {
        Animal animal = new Animal();

        animal.setId(request.getId());
        animal.setNome(request.getNome());
        animal.setSexo(request.getSexo());
        animal.setAlergias(request.getAlergias());
        animal.setDataNascimento(request.getDataNascimento());
        animal.setImagem(request.getImagem());
        animal.setCastrado(request.isCastrado());
        animal.setPeso(request.getPeso());
        animal.setNumeroFicha(request.getNumeroFicha());
        animal.setOrigemAnimal(request.getOrigemAnimal());
        animal.setObito(request.isObito());
        animal.setTipo(request.getTipo());

        return animal;
    }

    public AnimalResponseFix toResponse(Animal animal) {

        RacaResponseFix racaResponse = null;

        if (animal.getRaca() != null) {
            racaResponse = RacaResponseFix.builder()
                    .id(animal.getRaca().getId())
                    .nome(animal.getRaca().getNome())
                    .porte(animal.getRaca().getPorte())
                    .descricao(animal.getRaca().getDescricao())
                    .build();
        }

        return AnimalResponseFix.builder()
                .id(animal.getId())
                .nome(animal.getNome())
                .sexo(animal.getSexo())
                .alergias(animal.getAlergias())
                .dataNascimento(animal.getDataNascimento())
                .imagem(animal.getImagem())
                .castrado(animal.isCastrado())
                .peso(animal.getPeso())
                .numeroFicha(animal.getNumeroFicha())
                .raca(racaResponse)
                .origemAnimal(animal.getOrigemAnimal())
                .obito(animal.isObito())
                .codigoProntuario(animal.getCodigoProntuario())
                .tipo(animal.getTipo())
                .build();
    }

     public List<AnimalResponseFix> toResponseList(List<Animal> animais) {
        return animais.stream()
                .map(this::toResponse)
                .toList();
    }
}