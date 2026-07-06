package br.edu.ufape.hvu.service;

import br.edu.ufape.hvu.model.Animal;
import br.edu.ufape.hvu.model.ContadorProntuario;
import br.edu.ufape.hvu.model.enums.TipoAnimal;
import br.edu.ufape.hvu.repository.ContadorProntuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CodigoProntuarioService {

    private final ContadorProntuarioRepository contadorProntuarioRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public String garantirCodigoProntuario(long animalId) {

        Animal animal = entityManager.find(
                Animal.class,
                animalId,
                LockModeType.PESSIMISTIC_WRITE);

        if (animal == null) {
            throw new IllegalArgumentException(
                    "Animal não encontrado com id " + animalId);
        }

        if (animal.getCodigoProntuario() != null &&
                !animal.getCodigoProntuario().isBlank()) {
            return animal.getCodigoProntuario();
        }

        String codigo = proximoCodigo(animal.getTipo());

        animal.setCodigoProntuario(codigo);

        return codigo;
    }

    @Transactional
    public ContadorProntuario definirValorInicial(int valorInicial) {

        if (valorInicial < 1) {
            throw new IllegalArgumentException(
                    "Valor inicial deve ser maior ou igual a 1.");
        }

        ContadorProntuario contador = buscarContadorComLock();

        if (contador.isValorInicialConfigurado()) {
            throw new IllegalArgumentException(
                    "O valor inicial já foi configurado.");
        }

        if (contador.getUltimoValor() > 0) {
            throw new IllegalArgumentException(
                    "Já existem códigos de prontuário gerados.");
        }

        contador.setUltimoValor(valorInicial - 1);
        contador.setValorInicialConfigurado(true);

        return contadorProntuarioRepository.save(contador);
    }

    private String proximoCodigo(TipoAnimal tipo) {

        ContadorProntuario contador = buscarContadorComLock();

        contador.setUltimoValor(contador.getUltimoValor() + 1);
        contadorProntuarioRepository.save(contador);

        return switch (tipo) {
            case COMUM ->
                    String.format("%03d", contador.getUltimoValor());

            case SILVESTRE ->
                    String.format("%03dSIL", contador.getUltimoValor());
        };
    }

    private ContadorProntuario buscarContadorComLock() {

        return entityManager.createQuery(
                        "SELECT c FROM ContadorProntuario c",
                        ContadorProntuario.class)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .getSingleResult();
    }
}