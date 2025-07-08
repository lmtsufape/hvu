package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Secretario;
import br.edu.ufape.hvu.repository.SecretarioRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class SecretarioSeeder {
    private final SecretarioRepository secretarioRepository;
    private final UsuarioSeeder usuarioSeeder;

    public void init() {
        if (secretarioRepository.count() > 0) {
            return;
        }

        Faker faker = new Faker(new Locale("pt-BR"));
        Endereco endereco = usuarioSeeder.criarEndereco(faker);

        Secretario secretario = criarSecretario(faker, endereco);
        secretarioRepository.save(secretario);
    }

    protected Secretario criarSecretario(Faker faker, Endereco endereco) {
        Secretario secretario = new Secretario();
        secretario.setNome("secretario");
        secretario.setEmail("secretario@secretario.com");
        secretario.setTelefone(faker.phoneNumber().phoneNumber());
        secretario.setDeleted(false);
        secretario.setCpf(faker.idNumber().valid());
        secretario.setEndereco(endereco);
        secretario.setUserId("d97732b6-3c8a-4495-bfc1-32ec0cb87d62"); // UUID do Keycloak

        return secretario;
    }
}
