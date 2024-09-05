package br.edu.ufape.hvu.repository.seeders;


import br.edu.ufape.hvu.model.Endereco;
import br.edu.ufape.hvu.model.Usuario;
import br.edu.ufape.hvu.repository.UsuarioRepository;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class UsuarioSeeder{
    final private UsuarioRepository usuarioRepository;


    public void init(){
        if(usuarioRepository.count() > 0){
            return;
        }
        Faker faker = new Faker();
        for(int i = 0; i < 3; i++){

            Endereco endereco = criarEndereco(faker);

            Usuario usuario = criarUsuario(faker, endereco);

            usuarioRepository.save(usuario);
        }

    }

    protected Endereco criarEndereco(Faker faker){
        Endereco endereco = new Endereco();
        endereco.setCep(faker.address().zipCode());
        endereco.setRua(faker.address().streetName());
        endereco.setEstado(faker.address().state());
        endereco.setCidade(faker.address().cityName());
        endereco.setNumero(faker.number().numberBetween(1,1000));
        endereco.setBairro(faker.address().streetAddressNumber());
        return endereco;
    }

    protected Usuario criarUsuario(Faker faker, Endereco endereco){
        Usuario usuario = new Usuario();
        usuario.setNome(faker.name().fullName());
        usuario.setEmail(faker.internet().emailAddress());
        usuario.setTelefone(faker.phoneNumber().phoneNumber());
        usuario.setCpf(faker.idNumber().valid());
        usuario.setSenha("12345678");
        usuario.setEndereco(endereco);
        return usuario;
    }
}
