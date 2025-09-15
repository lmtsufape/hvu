package br.edu.ufape.hvu.repository.seeders;

import br.edu.ufape.hvu.model.Agendamento;
import br.edu.ufape.hvu.model.Ficha;
import br.edu.ufape.hvu.model.enums.TipoFicha;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.repository.FichaRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class FichaSeeder {
    private final FichaRepository fichaRepository;
    private final AgendamentoRepository agendamentoRepository;

    public void init(){
        if(fichaRepository.count() > 0){
            return;
        }

        List<Agendamento> agendamentos = agendamentoRepository.findAll();
        if (agendamentos.isEmpty()) {
            throw new RuntimeException("Nenhum agendamento disponível para vincular às fichas.");
        }

        Faker faker = new Faker();
        TipoFicha[] tipos = TipoFicha.values();
        ObjectMapper mapper = new ObjectMapper();

        for (int i = 0; i < 3; i++) {
            Ficha ficha = new Ficha();

            TipoFicha tipoFichaAleatorio = tipos[faker.random().nextInt(tipos.length)];
            ficha.setNome(tipoFichaAleatorio.toString());

            Map<String, Object> conteudo = new HashMap<>();
            conteudo.put("peso", faker.number().randomDouble(1, 50, 100));
            conteudo.put("queixa_principal", faker.lorem().sentence());
            conteudo.put("historico_medico_previo", faker.lorem().sentence());

            try {
                String conteudoJson = mapper.writeValueAsString(conteudo);
                ficha.setConteudo(conteudoJson);
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Erro ao criar JSON de conteúdo da ficha", e);
            }

            ficha.setDataHora(LocalDateTime.parse("2025-04-08T10:00:00"));
            Agendamento agendamentoAleatorio = agendamentos.get(faker.random().nextInt(agendamentos.size()));
            ficha.setAgendamento(agendamentoAleatorio);

            fichaRepository.save(ficha);
        }
    }

}
