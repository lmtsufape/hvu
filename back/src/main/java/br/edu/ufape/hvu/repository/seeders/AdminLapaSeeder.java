package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.AdminLapa;
import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.repository.AdminLapaRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class AdminLapaSeeder {
    private final AdminLapaRepository adminLapaRepository;
    private final UsuarioSeeder usuarioSeeder;

    public void init() {
        if (adminLapaRepository.count() > 0) {
            return;
        }

        Faker faker = new Faker(new Locale("pt-BR"));
        Endereco endereco = usuarioSeeder.criarEndereco(faker);

        AdminLapa admin = criarAdminLapa(faker, endereco);
        adminLapaRepository.save(admin);
    }

    protected AdminLapa criarAdminLapa(Faker faker, Endereco endereco) {
        AdminLapa admin = new AdminLapa();
        admin.setNome("admin_lapa");
        admin.setEmail("admin_lapa@admin_lapa.com");
        admin.setTelefone(faker.phoneNumber().cellPhone());
        admin.setCpf(faker.idNumber().valid());
        admin.setDeleted(false);
        admin.setEndereco(endereco);
        admin.setUserId("6c7fe50-75d7-48a0-bcfb-32c2000f485e"); // UUID do Keycloak

        return admin;
    }

}
