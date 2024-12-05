package br.edu.ufape.hvu.facade;

import java.io.File;
import java.io.InputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import br.edu.ufape.hvu.controller.dto.request.ReagendamentoRequest;
import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import lombok.RequiredArgsConstructor;
import br.edu.ufape.hvu.model.enums.StatusAgendamentoEVaga;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.edu.ufape.hvu.controller.dto.request.AgendamentoEspecialRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaCreateRequest;
import br.edu.ufape.hvu.controller.dto.request.VagaTipoRequest;
import br.edu.ufape.hvu.exception.DuplicateAccountException;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.service.*;
import jakarta.transaction.Transactional;

import javax.xml.crypto.Data;

@Service @RequiredArgsConstructor
public class Facade {
    // Auth--------------------------------------------------------------
    private final KeycloakService keycloakService;

    public TokenResponse login(String username, String password) {
        return keycloakService.login(username, password);
    }

    public TokenResponse refresh(String refreshToken) {
        return keycloakService.refreshToken(refreshToken);
    }
    // Tutor--------------------------------------------------------------

    private final TutorServiceInterface tutorServiceInterface;



    @Transactional
    public Tutor saveTutor(Tutor newInstance, String password) throws ResponseStatusException {
        String userKcId = null;
        keycloakService.createUser(newInstance.getCpf(), newInstance.getEmail(), password, "tutor");
        try {
            userKcId = keycloakService.getUserId(newInstance.getEmail());
            newInstance.setUserId(userKcId);
            return tutorServiceInterface.saveTutor(newInstance);
        }catch (DataIntegrityViolationException e){
            keycloakService.deleteUser(userKcId);
            throw e;
        }catch (Exception e){
            keycloakService.deleteUser(userKcId);
            throw new RuntimeException("Ocorreu um erro inesperado ao salvar o usuário: "+ e.getMessage(), e);
        }

    }

    @Transactional
    public Tutor updateTutor(Tutor transientObject) {
        try {
            Tutor newTutor =  tutorServiceInterface.updateTutor(transientObject);
            keycloakService.updateUser(newTutor.getUserId(), newTutor.getEmail());
            return newTutor;
        }catch (Exception e){
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    public Tutor findTutorById(long id, String idSession) {
        Tutor tutor = tutorServiceInterface.findTutorById(id);

        if(!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession) && !tutor.getUserId().equals(idSession)){
            throw new AccessDeniedException("You do not have permission to get this tutor");
        }

        return tutor;
    }

    public Tutor findTutorByuserId(String userId) {
        return tutorServiceInterface.findTutorByuserId(userId);
    }

    public Tutor findTutorByanimalId(long animalId) {
        return tutorServiceInterface.findTutorByanimalId(animalId);
    }

    public List<Tutor> getAllTutor() {
        return tutorServiceInterface.getAllTutor();
    }

    public void deleteTutor(Tutor persistentObject) {
        tutorServiceInterface.deleteTutor(persistentObject);
    }

    @Transactional
    public void deleteTutor(long id, String idSession) {
        try {
            tutorServiceInterface.deleteTutor(id);
            keycloakService.deleteUser(idSession);
        }catch (Exception e){
            throw new RuntimeException("Error deleting user");
        }
    }

    // NivelHidratacao--------------------------------------------------------------
    @Autowired
    private NivelHidratacaoServiceInterface nivelHidratacaoServiceInterface;

    public NivelHidratacao saveNivelHidratacao(NivelHidratacao newInstance) {
        return nivelHidratacaoServiceInterface.saveNivelHidratacao(newInstance);
    }

    public NivelHidratacao updateNivelHidratacao(NivelHidratacao transientObject) {
        return nivelHidratacaoServiceInterface.updateNivelHidratacao(transientObject);
    }

    public NivelHidratacao findNivelHidratacaoById(long id) {
        return nivelHidratacaoServiceInterface.findNivelHidratacaoById(id);
    }

    public List<NivelHidratacao> getAllNivelHidratacao() {
        return nivelHidratacaoServiceInterface.getAllNivelHidratacao();
    }

    public void deleteNivelHidratacao(NivelHidratacao persistentObject) {
        nivelHidratacaoServiceInterface.deleteNivelHidratacao(persistentObject);
    }

    public void deleteNivelHidratacao(long id) {
        nivelHidratacaoServiceInterface.deleteNivelHidratacao(id);
    }

    // Cancelamento--------------------------------------------------------------
    @Autowired
    private CancelamentoServiceInterface cancelamentoServiceInterface;

    public Cancelamento cancelarAgendamento(Cancelamento newInstance) {
        Agendamento agendamento = findAgendamentoById(newInstance.getAgendamento().getId());
        agendamento.setStatus("Cancelado");
        Vaga vaga = getVagaByAgendamento(agendamento.getId());
        vaga.setStatus("Disponivel");
        vaga.setAgendamento(null);
        newInstance.setDataVaga(vaga.getDataHora());
        newInstance.setEspecialidade(vaga.getEspecialidade());
        newInstance.setDataCancelamento(LocalDateTime.now());
        return cancelamentoServiceInterface.saveCancelamento(newInstance);
    }

    public Cancelamento cancelarVaga(Cancelamento newInstance) {
        Vaga vaga = findVagaById(newInstance.getVaga().getId());
        vaga.setStatus("Cancelado");
        if(vaga.getAgendamento() != null) {
            Agendamento agendamento = findAgendamentoById(vaga.getAgendamento().getId());
            agendamento.setStatus("Cancelado");
        }
        vaga.setAgendamento(null);
        newInstance.setDataVaga(vaga.getDataHora());
        newInstance.setEspecialidade(vaga.getEspecialidade());
        newInstance.setDataCancelamento(LocalDateTime.now());
        return cancelamentoServiceInterface.saveCancelamento(newInstance);
    }

    public Cancelamento updateCancelamento(Cancelamento transientObject) {
        return cancelamentoServiceInterface.updateCancelamento(transientObject);
    }

    public Cancelamento findCancelamentoById(long id) {
        return cancelamentoServiceInterface.findCancelamentoById(id);
    }

    public List<Cancelamento> findCancelamentoByTutorId(long id) {
        Tutor tutor = tutorServiceInterface.findTutorById(id);
        return cancelamentoServiceInterface.findCancelamentosByTutorId(tutor.getId());
    }

    public List<Cancelamento> getAllCancelamento() {
        return cancelamentoServiceInterface.getAllCancelamento();
    }

    public void deleteCancelamento(Cancelamento persistentObject) {
        cancelamentoServiceInterface.deleteCancelamento(persistentObject);
    }

    public void deleteCancelamento(long id) {
        cancelamentoServiceInterface.deleteCancelamento(id);
    }

    // TipoConsulta--------------------------------------------------------------
    @Autowired
    private TipoConsultaServiceInterface tipoConsultaServiceInterface;

    public TipoConsulta saveTipoConsulta(TipoConsulta newInstance) {
        return tipoConsultaServiceInterface.saveTipoConsulta(newInstance);
    }

    public TipoConsulta updateTipoConsulta(TipoConsulta transientObject) {
        return tipoConsultaServiceInterface.updateTipoConsulta(transientObject);
    }

    public TipoConsulta findTipoConsultaById(long id) {
        return tipoConsultaServiceInterface.findTipoConsultaById(id);
    }

    public List<TipoConsulta> getAllTipoConsulta() {
        return tipoConsultaServiceInterface.getAllTipoConsulta();
    }

    public void deleteTipoConsulta(TipoConsulta persistentObject) {
        tipoConsultaServiceInterface.deleteTipoConsulta(persistentObject);
    }

    public void deleteTipoConsulta(long id) {
        tipoConsultaServiceInterface.deleteTipoConsulta(id);
    }

    // Usuario--------------------------------------------------------------
    @Autowired
    private UsuarioServiceInterface usuarioServiceInterface;

    public Usuario saveUsuario(Usuario newInstance) {
        return usuarioServiceInterface.saveUsuario(newInstance);
    }

    public Usuario updateUsuario(Usuario transientObject, String idSession) {
        return usuarioServiceInterface.updateUsuario(transientObject, idSession);
    }

    public Usuario findUsuarioById(long id, String idSession) {
        return usuarioServiceInterface.findUsuarioById(id, idSession);
    }

    public Usuario findUsuarioByuserId(String userId) throws IdNotFoundException {
        return usuarioServiceInterface.findUsuarioByuserId(userId);
    }

    public void findDuplicateAccountByuserId(String userId) throws DuplicateAccountException {
        try {
            Usuario usuario = findUsuarioByuserId(userId);
            if (usuario instanceof Tutor) {
                throw new DuplicateAccountException("tutor");
            }

            if (usuario instanceof Medico) {
                throw new DuplicateAccountException("medico");
            }

        } catch (IdNotFoundException ex) {

        }

    }

    public List<Usuario> getAllUsuario() {
        return usuarioServiceInterface.getAllUsuario();
    }

    public void deleteUsuario(Usuario persistentObject) {
        usuarioServiceInterface.deleteUsuario(persistentObject);
    }

    public void deleteUsuario(long id) {
        usuarioServiceInterface.deleteUsuario(id);
    }

    // Cronograma--------------------------------------------------------------
    @Autowired
    private CronogramaServiceInterface cronogramaServiceInterface;

    public Cronograma saveCronograma(Cronograma newInstance) {
        return cronogramaServiceInterface.saveCronograma(newInstance);
    }

    public Cronograma updateCronograma(Cronograma transientObject) {
        return cronogramaServiceInterface.updateCronograma(transientObject);
    }

    public Cronograma findCronogramaById(long id) {
        return cronogramaServiceInterface.findCronogramaById(id);
    }

    public List<Cronograma> findCronogramaByMedicoId(long id){
        Medico medico = findMedicoById(id);
        return cronogramaServiceInterface.findCronogramaByMedico(medico);
    }

    public List<Cronograma> findCronogramaByEspecialidadeId(long id){
        Especialidade especialidade = findEspecialidadeById(id);
        return cronogramaServiceInterface.findCronogramaByEspecialidade(especialidade);
    }

    public List<Cronograma> getAllCronograma() {
        return cronogramaServiceInterface.getAllCronograma();
    }



    public Map<LocalDateTime, List<Cronograma>> scheduleAvailable (LocalDate data, String turno, Especialidade especialidade) {
        LocalTime shiftBegin = turno.equals("Manhã") ? LocalTime.of(6, 0) : LocalTime.of(12, 0);
        LocalTime shiftEnd = turno.equals("Manhã") ? LocalTime.of(12, 0) : LocalTime.of(20, 0);

        Map<LocalDateTime, List<Cronograma>> horariosCronogramas = new TreeMap<>();

        List<Cronograma> cronogramas = findByEspecialidadeAndDiaAndTurno(especialidade, data.getDayOfWeek(), turno);
        for (Cronograma cronograma : cronogramas) {

            List<LocalDateTime> scheduleFilled = findVagaByDataAndEspecialidadeAndMedico(data, especialidade, cronograma.getMedico())
                    .stream()
                    .map(Vaga::getDataHora)
                    .collect(Collectors.toList());

            LocalTime currentTime = cronograma.getHorarios().get(data.getDayOfWeek()).getInicio();
            if (currentTime.isBefore(shiftBegin)){
                currentTime = shiftBegin;
            }
            LocalTime shiftEndCronograma = cronograma.getHorarios().get(data.getDayOfWeek()).getFim();

            while (currentTime.plusMinutes(Math.round(cronograma.getTempoAtendimento() - 1)).isBefore(shiftEnd) &&
                    currentTime.plusMinutes(Math.round(cronograma.getTempoAtendimento() - 1)).isBefore(shiftEndCronograma) ||
                    currentTime.plusMinutes(Math.round(cronograma.getTempoAtendimento() - 1)).equals(shiftEnd) &&
                            currentTime.plusMinutes(Math.round(cronograma.getTempoAtendimento() - 1)).equals(shiftEndCronograma)){
                LocalDateTime scheduleFull = LocalDateTime.of(data, currentTime);

                if (!scheduleFilled.contains(scheduleFull)) {
                    horariosCronogramas.computeIfAbsent(scheduleFull, k -> new ArrayList<>()).add(cronograma);
                    scheduleFilled.add(scheduleFull);
                }

                currentTime = currentTime.plusMinutes(Math.round(cronograma.getTempoAtendimento()));
            }
        }

        return horariosCronogramas;
    }

    public List<Cronograma> findByEspecialidadeAndDiaAndTurno(Especialidade especialidade, DayOfWeek dia, String turno){
        return cronogramaServiceInterface.findByEspecialidadeAndDiaAndTurno(especialidade, dia, turno);
    }

    public void deleteCronograma(Cronograma persistentObject) {
        cronogramaServiceInterface.deleteCronograma(persistentObject);
    }

    public void deleteCronograma(long cronogramaId) {
        Cronograma cronograma = findCronogramaById(cronogramaId);
        cronogramaServiceInterface.deleteCronograma(cronograma.getId());
    }

    // Medico--------------------------------------------------------------
    private final MedicoServiceInterface medicoService;

    @Transactional
    public Medico saveMedico(Medico newInstance, String password) {
        String userKcId = null;
        keycloakService.createUser(newInstance.getCpf(), newInstance.getEmail(), password, "medico");
        try {
            userKcId = keycloakService.getUserId(newInstance.getEmail());
            newInstance.setUserId(userKcId);
            return medicoService.saveMedico(newInstance);
        }catch (DataIntegrityViolationException e){
            keycloakService.deleteUser(userKcId);
            throw e;
        }catch (Exception e){
            keycloakService.deleteUser(userKcId);
            throw new RuntimeException("Ocorreu um erro inesperado ao salvar o usuário: "+ e.getMessage(), e);
        }
    }

    @Transactional
    public Medico updateMedico(Medico transientObject) {
        try {
            Medico newMedico =  medicoService.updateMedico(transientObject);
            keycloakService.updateUser(newMedico.getUserId(), newMedico.getEmail());
            return newMedico;
        }catch (Exception e){
            throw new RuntimeException("Error updating user: " + e.getMessage());
        }
    }

    public Medico findMedicoById(long id) {
        return medicoService.findMedicoById(id);
    }

    public Medico findMedicoByuserId(String userId) throws IdNotFoundException {
        return medicoService.findMedicoByuserId(userId);
    }


    public List<Medico> getAllMedico() {
        return medicoService.getAllMedico();
    }


    public void deleteMedico(Medico persistentObject) {
        try {
            medicoService.deleteMedico(persistentObject);
            keycloakService.deleteUser(persistentObject.getUserId());
        }catch (Exception e){
            throw new RuntimeException("Error deleting user");
        }
    }

    public void deleteMedico(long id) {
        medicoService.deleteMedico(id);
    }

    public List<Medico> findByInstituicao(long InstituicaoId){
        Instituicao instituicao = findInstituicaoById(InstituicaoId);
        return medicoService.findByInstituicao(instituicao);
    }

    public List<Medico> findByEspeciallidade(long EspecialidadeId) {
        Especialidade especialidade = findEspecialidadeById(EspecialidadeId);
        return medicoService.findByEspecialidade(especialidade);
    }

    // Raca--------------------------------------------------------------
    @Autowired
    private RacaServiceInterface racaServiceInterface;

    public Raca saveRaca(Raca newInstance) {
        return racaServiceInterface.saveRaca(newInstance);
    }

    public Raca updateRaca(Raca transientObject) {
        return racaServiceInterface.updateRaca(transientObject);
    }

    public Raca findRacaById(long id) {
        return racaServiceInterface.findRacaById(id);
    }

    public List<Raca> getAllRaca() {
        return racaServiceInterface.getAllRaca();
    }

    public List<Raca> findByEspecie(long EspecieId) {
        Especie especie = findEspecieById(EspecieId);
        return racaServiceInterface.findByEspecie(especie);
    }

    public void deleteRaca(Raca persistentObject) {
        racaServiceInterface.deleteRaca(persistentObject);
    }

    public void deleteRaca(long id) {
        racaServiceInterface.deleteRaca(id);
    }

    // Vaga--------------------------------------------------------------
    @Autowired
    private VagaServiceInterface vagaServiceInterface;

    public Vaga saveVaga(Vaga newInstance) {
        newInstance.setStatus(String.valueOf(StatusAgendamentoEVaga.Disponivel));
        return vagaServiceInterface.saveVaga(newInstance);
    }

    public Vaga updateVaga(Vaga transientObject) {
        return vagaServiceInterface.updateVaga(transientObject);
    }

    public Vaga findVagaById(long id) {
        return vagaServiceInterface.findVagaById(id);
    }

    public List<Vaga> getAllVaga() {
        return vagaServiceInterface.getAllVaga();
    }

    public List<Vaga> findVagaByData(LocalDate data){
        return vagaServiceInterface.findVagasByData(data);
    }

    public List<Vaga> findVagaBetweenInicialAndFinalDate(LocalDate dataInicial, LocalDate dataFinal){
        return vagaServiceInterface.findVagaBetweenInicialAndFinalDate(dataInicial,dataFinal);
    }


    public List<Vaga> findVagasAndAgendamentoByMedico (LocalDate data, Long IdMedico){
        Medico medico = findMedicoById(IdMedico);

        return vagaServiceInterface.findVagasAndAgendamentoByMedico(data, medico);
    }

    public List<Vaga> findVagaByDataAndEspecialidade(LocalDate data, Especialidade especialidade){
        return vagaServiceInterface.findVagasByDataAndEspecialidade(data, especialidade);
    }

    public List<Animal> findAnimaisWithReturn(){
        List<Vaga> vagas = vagaServiceInterface.findLatestVagaForEachAnimal();

        return vagas.stream()
                .map(vaga -> vaga.getAgendamento().getAnimal())
                .collect(Collectors.toList());
    }

    public List<Animal> findAnimaisWithoutReturn(){
        List<Vaga> vagas = vagaServiceInterface.findLatestVagaForEachAnimalNotReturn();

        List<Animal> allAnimais = getAllAnimal();
        List<Agendamento> allAgendamento = getAllAgendamento();
        List<Animal> animalNoReturn = allAnimais.stream()
                .filter(animal->allAgendamento.stream()
                        .noneMatch(agendamento -> agendamento.getAnimal().equals(animal)))
                .collect(Collectors.toList());

        animalNoReturn
                .addAll(vagas.stream()
                        .map(vaga -> vaga.getAgendamento().getAnimal())
                        .collect(Collectors.toList()));
        return animalNoReturn;
    }

    public boolean isRetornoExpirado(Long id) {
        List<Vaga> vagas = vagaServiceInterface.findLatestVagaForEachAnimal();
        Animal animal = animalServiceInterface.findAnimalById(id);
        Vaga ultimaVaga = vagas.stream()
                        .filter(vaga -> vaga.getAgendamento().getAnimal().equals(animal))
                        .reduce((first, second) -> second)
                        .orElse(null);

        if (ultimaVaga != null) {
            throw new RuntimeException("Vaga não encontrada no momento da procura pelo retorno expirado.");
        }

        LocalDate dataUltimaVaga = ultimaVaga.getDataHora().toLocalDate();
        LocalDate dataAtual = LocalDate.now();

        long diasDesdeUltimaConsulta = ChronoUnit.DAYS.between(dataUltimaVaga, dataAtual);

        return diasDesdeUltimaConsulta > 30; // Retorna verdadeiro se expirou
    }

    public String verificaSeAnimalPodeMarcarPrimeiraConsultaRetornoOuConsulta(Long id){
        // verifica se animal já tem uma consulta em aberto -> "Bloqueado"
        List<Agendamento> allAgendamentos = getAllAgendamento();
        Animal animal = animalServiceInterface.findAnimalById(id);

        boolean consultaEmAberto = allAgendamentos.stream()
                .anyMatch(agendamento -> agendamento.getAnimal() != null &&
                        agendamento.getAnimal().getId() == id &&
                        !agendamento.getStatus().equals("Finalizado") && !agendamento.getStatus().equals("Cancelado"));

        if(consultaEmAberto){
            return "Bloqueado";
        }else if(isAnimalWithRetorno(id) || !isRetornoExpirado(id)){
            return "Retorno";
        }else{
            return "Primeira Consulta";
        }
    }

    public boolean isAnimalWithRetorno(Long id) {
        Animal animal = animalServiceInterface.findAnimalById(id);
        return findAnimaisWithReturn().contains(animal);
    }

    public List<Vaga> findVagaByDataAndEspecialidadeAndMedico(LocalDate data, Especialidade especialidade, Medico medico){
        return vagaServiceInterface.findVagasByDataAndEspecialidadeAndMedico(data, especialidade, medico);
    }

    public List<Vaga> findVagaByDataAndTurno(LocalDate data, String turno){
        return vagaServiceInterface.findVagasByDataAndTurno(data, turno);
    }

    public void deleteVaga(Vaga persistentObject) {
        vagaServiceInterface.deleteVaga(persistentObject);
    }

    public void deleteVaga(long id) {
        vagaServiceInterface.deleteVaga(id);
    }

    public List<Vaga> getVagasByEspecialidade(long idEspecialidade) {
        Especialidade especialidade = especialidadeServiceInterface.findEspecialidadeById(idEspecialidade);
        return vagaServiceInterface.findVagaByEspecialidade(especialidade);
    }

    public Vaga getVagaByAgendamento(long idAgendamento) {
        Agendamento agendamento = findAgendamentoById(idAgendamento);
        return vagaServiceInterface.findVagaByAgendamento(agendamento);
    }

    @Transactional
    public String createVagasByTurno(VagaCreateRequest vagaRequestDTO) {
        List<Vaga> vagas = new ArrayList<>();
        LocalDate startDate = vagaRequestDTO.getData();
        LocalDate endDate = vagaRequestDTO.getDataFinal();
        final long[] countCriacao = new long[2]; // countCriacao[0] quantidade criada, countCriacao[1] nao criada
        StringBuilder detalheBuilder = new StringBuilder();

        if (endDate == null) {
            if (!isWeekend(startDate)) {
                detalheBuilder.append(createVagas(startDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao));
                detalheBuilder.append(" ").append(createVagas(startDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao));
            }
        } else {
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                if (!isWeekend(currentDate)) {
                    detalheBuilder.append(createVagas(currentDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao));
                    detalheBuilder.append(" ").append(createVagas(currentDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao));
                }
                currentDate = currentDate.plusDays(1);
            }
        }

        return detalheBuilder.toString().trim();
    }

    private boolean isWeekend(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    private String createVagas(LocalDate data, List<VagaTipoRequest> vagaTipo, String turno, List<Vaga> vagas, long[] countCriacao) {
        List<Vaga> vagasByData = findVagaByData(data);
        List<Vaga> vagasByDataAndTurno = findVagaByDataAndTurno(data, turno);
        vagasByData.removeIf(vaga -> Objects.equals(vaga.getStatus(), "Cancelado"));
        vagasByDataAndTurno.removeIf(vaga -> Objects.equals(vaga.getStatus(), "Cancelado"));
        final long[] count = new long[2];
        count[0] = vagasByData.size(); // Total vagas no dia
        count[1] = vagasByDataAndTurno.size();  // Total vagas no turno

        if (count[0] >= 16 || count[1] >= 8) {
            throw new RuntimeException("Número máximo de vagas para o dia ou turno já foi atingido.");
        }

        StringBuilder detalheBuilder = new StringBuilder();
        for (VagaTipoRequest especialidadeTipo : vagaTipo) {
            LocalDateTime dateTime = LocalDateTime.of(data, especialidadeTipo.getHorario());
            try {
                Especialidade especialidade = findEspecialidadeById(especialidadeTipo.getEspecialidade().getId());
                TipoConsulta tipoConsulta = findTipoConsultaById(especialidadeTipo.getTipoConsulta().getId());
                Medico medico = findMedicoById(especialidadeTipo.getMedico().getId());

                if (count[0] < 16 && count[1] < 8) {
                    Vaga newVaga = new Vaga();

                    newVaga.setDataHora(dateTime);
                    newVaga.setEspecialidade(especialidade);
                    newVaga.setStatus("Disponível");
                    newVaga.setMedico(medico);
                    newVaga.setTipoConsulta(tipoConsulta);
                    saveVaga(newVaga);
                    vagas.add(newVaga);
                    count[0]++;
                    count[1]++;
                    countCriacao[0]++;
                    detalheBuilder.append("Vaga ").append(dateTime).append(" adicionada com sucesso. ");
                }
            } catch (RuntimeException e) {
                countCriacao[1]++;
                detalheBuilder.append("Vaga ").append(dateTime).append(" não foi adicionada: ").append(e.getMessage()).append(". ");
            }
        }
        return detalheBuilder.toString().trim();
    }

    // Prescricao--------------------------------------------------------------
    @Autowired
    private PrescricaoServiceInterface prescricaoServiceInterface;

    public Prescricao savePrescricao(Prescricao newInstance) {
        return prescricaoServiceInterface.savePrescricao(newInstance);
    }

    public Prescricao updatePrescricao(Prescricao transientObject) {
        return prescricaoServiceInterface.updatePrescricao(transientObject);
    }

    public Prescricao findPrescricaoById(long id) {
        return prescricaoServiceInterface.findPrescricaoById(id);
    }

    public List<Prescricao> getAllPrescricao() {
        return prescricaoServiceInterface.getAllPrescricao();
    }

    public void deletePrescricao(Prescricao persistentObject) {
        prescricaoServiceInterface.deletePrescricao(persistentObject);
    }

    public void deletePrescricao(long id) {
        prescricaoServiceInterface.deletePrescricao(id);
    }



    // Consulta--------------------------------------------------------------
    @Autowired
    private ConsultaServiceInterface consultaServiceInterface;

    public Consulta saveConsulta(Long id, Consulta newInstance) {
        Vaga vagaDaConsulta = vagaServiceInterface.findVagaById(id);
        Agendamento agendamentoVaga = agendamentoServiceInterface.findAgendamentoById(vagaDaConsulta.getAgendamento().getId());

        Consulta consulta = consultaServiceInterface.saveConsulta(newInstance);
        vagaDaConsulta.setStatus("Finalizado");
        agendamentoVaga.setStatus("Finalizado");

        vagaDaConsulta.setAgendamento(agendamentoVaga);
        vagaDaConsulta.setConsulta(consulta);
        updateVaga(vagaDaConsulta);
        updateAgendamento(agendamentoVaga);

        return consulta;
    }

    public Consulta updateConsulta(Consulta transientObject) {
        return consultaServiceInterface.updateConsulta(transientObject);
    }

    public Consulta findConsultaById(long id) {
        return consultaServiceInterface.findConsultaById(id);
    }

    public List<Consulta> getAllConsulta() {
        return consultaServiceInterface.getAllConsulta();
    }

    public List<Consulta> getConsultasByAnimalFichaNumero (String numeroFicha){
        return consultaServiceInterface.getConsultasByAnimalFichaNumero(numeroFicha);
    }

    public List<Consulta> getConsultaByAnimalId(Long id){
        return consultaServiceInterface.getConsultasByAnimalId(id);
    }

    public void deleteConsulta(Consulta persistentObject) {
        consultaServiceInterface.deleteConsulta(persistentObject);
    }

    public void deleteConsulta(long id) {
        consultaServiceInterface.deleteConsulta(id);
    }

    // Parecer--------------------------------------------------------------
    @Autowired
    private ParecerServiceInterface parecerServiceInterface;

    public Parecer saveParecer(Parecer newInstance) {
        return parecerServiceInterface.saveParecer(newInstance);
    }

    public Parecer updateParecer(Parecer transientObject) {
        return parecerServiceInterface.updateParecer(transientObject);
    }

    public Parecer findParecerById(long id) {
        return parecerServiceInterface.findParecerById(id);
    }

    public List<Parecer> getAllParecer() {
        return parecerServiceInterface.getAllParecer();
    }

    public void deleteParecer(Parecer persistentObject) {
        parecerServiceInterface.deleteParecer(persistentObject);
    }

    public void deleteParecer(long id) {
        parecerServiceInterface.deleteParecer(id);
    }

    // Especialidade--------------------------------------------------------------
    @Autowired
    private EspecialidadeServiceInterface especialidadeServiceInterface;

    public Especialidade saveEspecialidade(Especialidade newInstance) {
        return especialidadeServiceInterface.saveEspecialidade(newInstance);
    }

    public Especialidade updateEspecialidade(Especialidade transientObject) {
        return especialidadeServiceInterface.updateEspecialidade(transientObject);
    }

    public Especialidade findEspecialidadeById(long id) {
        return especialidadeServiceInterface.findEspecialidadeById(id);
    }

    public List<Especialidade> getAllEspecialidade() {
        return especialidadeServiceInterface.getAllEspecialidade();
    }

    public void deleteEspecialidade(Especialidade persistentObject) {
        especialidadeServiceInterface.deleteEspecialidade(persistentObject);
    }

    public void deleteEspecialidade(long id) {
        especialidadeServiceInterface.deleteEspecialidade(id);
    }

    // Agendamento--------------------------------------------------------------
    @Autowired
    private AgendamentoServiceInterface agendamentoServiceInterface;

    public Agendamento saveAgendamento(Agendamento newInstance, Long idVaga) {
        Vaga vaga = findVagaById(idVaga);
        if (vaga.getAgendamento() != null ){
            throw new IllegalStateException("A vaga não está disponível.");
        }

        vaga.setStatus("Agendado");
        vaga.setAgendamento(newInstance);
        newInstance.setDataVaga(vaga.getDataHora());
        newInstance.setStatus(vaga.getStatus());
        return agendamentoServiceInterface.saveAgendamento(newInstance);
    }

    public Agendamento createAgendamentoEspecial(AgendamentoEspecialRequest newObject) {
        Vaga vaga = new Vaga();
        Agendamento agendamento = new Agendamento();

        vaga.setEspecialidade(findEspecialidadeById(newObject.getEspecialidade().getId()));
        vaga.setMedico(findMedicoById(newObject.getMedico().getId()));
        vaga.setTipoConsulta(findTipoConsultaById(newObject.getTipoConsulta().getId()));
        vaga.setDataHora(newObject.getHorario());

        saveVaga(vaga);

        agendamento.setAnimal(animalServiceInterface.findAnimalById(newObject.getAnimal().getId()));
        agendamento.setTipoEspecial(newObject.isTipoEspecial());

        return saveAgendamento(agendamento, vaga.getId());
    }

    public Agendamento updateAgendamento(Agendamento transientObject) {
        return agendamentoServiceInterface.updateAgendamento(transientObject);
    }

    // Reagenda um agendamento para uma nova vaga
    public Agendamento reagendarAgendamento(Long idAgendamento, Long idVaga){
        Agendamento agendamento = findAgendamentoById(idAgendamento);
        Vaga vagaAntiga = getVagaByAgendamento(agendamento.getId());
        Vaga novaVaga = findVagaById(idVaga);

        // cancelando vaga anterior, que é a vaga antiga que precisa ser reagendada
        if (vagaAntiga != null){
            vagaAntiga.setStatus(String.valueOf(StatusAgendamentoEVaga.Cancelado));
            vagaAntiga.setAgendamento(null);
            updateVaga(vagaAntiga); //atualiza vaga antiga no banco
        }

        // veririfa se agendamento da vaga recebida está preenchido
        if(novaVaga.getAgendamento() != null){
            throw new RuntimeException("A nova vaga já está ocupada.");
        }

        // verifica se a nova vaga recibida esta cancelada
        if(novaVaga.getStatus().equals(String.valueOf(StatusAgendamentoEVaga.Cancelado))){
            throw new RuntimeException("A nova vaga está cancelada.");
        }

        // atulizando agendamento e vaga atual, que é a nova vaga do agendamento
        novaVaga.setStatus(String.valueOf(StatusAgendamentoEVaga.Agendado));
        agendamento.setDataVaga(novaVaga.getDataHora());
        agendamento.setStatus(novaVaga.getStatus());
        novaVaga.setAgendamento(agendamento);

        //atualizando no banco...
        updateAgendamento(agendamento);
        updateVaga(novaVaga);
        return agendamento;
    }

    public Agendamento findAgendamentoById(long id) {
        return agendamentoServiceInterface.findAgendamentoById(id);
    }

    public List<Agendamento> getAllAgendamento() {
        return agendamentoServiceInterface.getAllAgendamento();
    }

    public List<Agendamento> findAgendamentosByMedicoId(Long medicoId, String token){
        Medico medico = findMedicoById(medicoId);
        return agendamentoServiceInterface.findAgendamentosByMedicoId(medico, token);
    }

    public List<Agendamento> findAgendamentosByTutorId(String userId) {
        Tutor tutor = findTutorByuserId(userId);

        List<Animal> animals = tutor.getAnimal(); // Supondo que você tem um método getAnimais()

        List<Agendamento> agendamentos = new ArrayList<>();
        for (Animal animal : animals) {
            List<Agendamento> agendamentosForAnimal = agendamentoServiceInterface.findAgendamentosByAnimal(animal);
            agendamentos.addAll(agendamentosForAnimal);
        }

        return agendamentos;
    }

    public List<LocalDateTime> retornaVagaQueTutorNaoPodeAgendar(String id){
        Tutor tutor = tutorServiceInterface.findTutorById(Long.parseLong(id));

        List<Agendamento> agendamentosTutor = new ArrayList<>();
        for (Animal animal : tutor.getAnimal()) {
            List<Agendamento> agendamentosForAnimal = agendamentoServiceInterface.findAgendamentosByAnimal(animal);
            agendamentosTutor.addAll(agendamentosForAnimal);
        }

        List<Agendamento> filtroAgedamentos = agendamentosTutor.stream()
                .filter(agendamento -> agendamento.getStatus().equals("Agendado"))
                .toList();

        Set<LocalDateTime> datasFiltradas = filtroAgedamentos
                .stream()
                .map(Agendamento::getDataVaga)
                .collect(Collectors.toSet());

        return datasFiltradas
                .stream()
                .toList();
    }

    public void deleteAgendamento(Agendamento persistentObject) {
        agendamentoServiceInterface.deleteAgendamento(persistentObject);
    }

    public void deleteAgendamento(long id) {
        agendamentoServiceInterface.deleteAgendamento(id);
    }

    // Endereco--------------------------------------------------------------
    @Autowired
    private EnderecoServiceInterface enderecoServiceInterface;

    public Endereco saveEndereco(Endereco newInstance) {
        return enderecoServiceInterface.saveEndereco(newInstance);
    }

    public Endereco updateEndereco(Endereco transientObject) {
        return enderecoServiceInterface.updateEndereco(transientObject);
    }

    public Endereco findEnderecoById(long id) {
        return enderecoServiceInterface.findEnderecoById(id);
    }

    public List<Endereco> getAllEndereco() {
        return enderecoServiceInterface.getAllEndereco();
    }

    public void deleteEndereco(Endereco persistentObject) {
        enderecoServiceInterface.deleteEndereco(persistentObject);
    }

    public void deleteEndereco(long id) {
        enderecoServiceInterface.deleteEndereco(id);
    }

    // Estagiario--------------------------------------------------------------
    @Autowired
    private EstagiarioServiceInterface estagiarioServiceInterface;

    public Estagiario saveEstagiario(Estagiario newInstance) {
        return estagiarioServiceInterface.saveEstagiario(newInstance);
    }

    public Estagiario updateEstagiario(Estagiario transientObject) {
        return estagiarioServiceInterface.updateEstagiario(transientObject);
    }

    public Estagiario findEstagiarioById(long id) {
        return estagiarioServiceInterface.findEstagiarioById(id);
    }

    public List<Estagiario> getAllEstagiario() {
        return estagiarioServiceInterface.getAllEstagiario();
    }

    public void deleteEstagiario(Estagiario persistentObject) {
        estagiarioServiceInterface.deleteEstagiario(persistentObject);
    }

    public void deleteEstagiario(long id) {
        estagiarioServiceInterface.deleteEstagiario(id);
    }

    // Animal--------------------------------------------------------------
    @Autowired
    private AnimalServiceInterface animalServiceInterface;

    public Animal saveAnimal(Animal newInstance, String tutor_id) {
        Tutor tutor = findTutorByuserId(tutor_id);
        Animal animal = animalServiceInterface.saveAnimal(newInstance);
        tutor.getAnimal().add(animal);
        updateTutor(tutor);
        return animal;
    }

    public Animal updateAnimal(Animal transientObject, String idSession) {
        Tutor tutor = tutorServiceInterface.findTutorByanimalId(transientObject.getId());

        if (tutor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No tutor found");
        }

        if(!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession) && !tutor.getUserId().equals(idSession)) {
            throw new AccessDeniedException("This is not your animal");
        }

        return animalServiceInterface.updateAnimal(transientObject);
    }

    public Animal findAnimalById(long id, String idSession) {
        Animal animal = animalServiceInterface.findAnimalById(id);
        Tutor tutor = tutorServiceInterface.findTutorByanimalId(animal.getId());

        if (tutor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No tutor found for the animal with ID: " + animal.getId());
        }

        if(!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession) && !tutor.getUserId().equals(idSession)){
            throw new AccessDeniedException("This is not your animal");
        }

        return animal;
    }

    public List<Animal> getAllAnimal() {
        return animalServiceInterface.getAllAnimal();
    }

    public List<Animal> getAllAnimalTutor(String userId) {
        Tutor tutor = findTutorByuserId(userId);
        if(tutor.equals(null) ) {
            throw new ServiceException("Erro ao buscar os Agendamentos");
        }
        return tutor.getAnimal();
    }

    public Animal getAnimalByFichaNumber(String fichaNumero){
        return animalServiceInterface.findAnimalByFichaNumber(fichaNumero);
    }

    public void deleteAnimal(Animal persistentObject) {
        animalServiceInterface.deleteAnimal(persistentObject);
    }

    public void deleteAnimal(long id) {
        animalServiceInterface.deleteAnimal(id);
    }

    // Especie--------------------------------------------------------------
    @Autowired
    private EspecieServiceInterface especieServiceInterface;

    public Especie saveEspecie(Especie newInstance) {
        return especieServiceInterface.saveEspecie(newInstance);
    }

    public Especie updateEspecie(Especie transientObject) {
        return especieServiceInterface.updateEspecie(transientObject);
    }

    public Especie findEspecieById(long id) {
        return especieServiceInterface.findEspecieById(id);
    }

    public List<Especie> getAllEspecie() {
        return especieServiceInterface.getAllEspecie();
    }

    public void deleteEspecie(Especie persistentObject) {
        especieServiceInterface.deleteEspecie(persistentObject);
    }

    public void deleteEspecie(long id) {
        especieServiceInterface.deleteEspecie(id);
    }

    // ScoreCorporal--------------------------------------------------------------
    @Autowired
    private ScoreCorporalServiceInterface scoreCorporalServiceInterface;

    public ScoreCorporal saveScoreCorporal(ScoreCorporal newInstance) {
        return scoreCorporalServiceInterface.saveScoreCorporal(newInstance);
    }

    public ScoreCorporal updateScoreCorporal(ScoreCorporal transientObject) {
        return scoreCorporalServiceInterface.updateScoreCorporal(transientObject);
    }

    public ScoreCorporal findScoreCorporalById(long id) {
        return scoreCorporalServiceInterface.findScoreCorporalById(id);
    }

    public List<ScoreCorporal> getAllScoreCorporal() {
        return scoreCorporalServiceInterface.getAllScoreCorporal();
    }

    public void deleteScoreCorporal(ScoreCorporal persistentObject) {
        scoreCorporalServiceInterface.deleteScoreCorporal(persistentObject);
    }

    public void deleteScoreCorporal(long id) {
        scoreCorporalServiceInterface.deleteScoreCorporal(id);
    }

    // Area--------------------------------------------------------------
    @Autowired
    private AreaServiceInterface areaServiceInterface;

    public Area saveArea(Area newInstance) {
        return areaServiceInterface.saveArea(newInstance);
    }

    public Area updateArea(Area transientObject) {
        return areaServiceInterface.updateArea(transientObject);
    }

    public Area findAreaById(Long id) {
        return areaServiceInterface.findAreaById(id);
    }

    public List<Area> getAllArea() {
        return areaServiceInterface.getAllArea();
    }

    public void deleteArea(Area persistentObject) {
        areaServiceInterface.deleteArea(persistentObject);
    }

    public void deleteArea(long id) {
        areaServiceInterface.deleteArea(id);
    }

    // CampoLaudo--------------------------------------------------------------
    @Autowired
    private CampoLaudoServiceInterface campoLaudoServiceInterface;

    public CampoLaudo saveCampoLaudo(CampoLaudo newInstance) {
        return campoLaudoServiceInterface.saveCampoLaudo(newInstance);
    }

    public CampoLaudo updateCampoLaudo(CampoLaudo transientObject) {
        return campoLaudoServiceInterface.updateCampoLaudo(transientObject);
    }

    public CampoLaudo findCampoLaudoById(Long id) {
        return campoLaudoServiceInterface.findCampoLaudoById(id);
    }

    public List<CampoLaudo> getAllCampoLaudo() {
        return campoLaudoServiceInterface.getAllCampoLaudo();
    }

    public void deleteCampoLaudo(CampoLaudo persistentObject) {
        campoLaudoServiceInterface.deleteCampoLaudo(persistentObject);
    }

    public void deleteCampoLaudo(long id) {
        campoLaudoServiceInterface.deleteCampoLaudo(id);
    }

    // Etapa--------------------------------------------------------------
    @Autowired
    private EtapaServiceInterface etapaServiceInterface;

    public Etapa saveEtapa(Etapa newInstance) {
        return etapaServiceInterface.saveEtapa(newInstance);
    }

    public Etapa updateEtapa(Etapa transientObject) {
        return etapaServiceInterface.updateEtapa(transientObject);
    }

    public Etapa findEtapaById(Long id) {
        return etapaServiceInterface.findEtapaById(id);
    }

    public List<Etapa> getAllEtapa() {
        return etapaServiceInterface.getAllEtapa();
    }

    public void deleteEtapa(Etapa persistentObject) {
        etapaServiceInterface.deleteEtapa(persistentObject);
    }

    public void deleteEtapa(long id) {
        etapaServiceInterface.deleteEtapa(id);
    }

    // FichaSolicitacaoServico--------------------------------------------------------------

    @Autowired
    private FichaSolicitacaoServicoServiceInterface fichaSolicitacaoServicoServiceInterface;

    public FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico newInstance) {
        return fichaSolicitacaoServicoServiceInterface.saveFichaSolicitacaoServico(newInstance);
    }

    public FichaSolicitacaoServico updateFichaSolicitacaoServico(FichaSolicitacaoServico transientObject) {
        return fichaSolicitacaoServicoServiceInterface.updateFichaSolicitacaoServico(transientObject);
    }

    public FichaSolicitacaoServico findFichaSolicitacaoServicoById(Long id) {
        return fichaSolicitacaoServicoServiceInterface.findFichaSolicitacaoServicoById(id);
    }

    public List<FichaSolicitacaoServico> getAllFichaSolicitacaoServico() {
        return fichaSolicitacaoServicoServiceInterface.getAllFichaSolicitacaoServico();
    }

    public void deleteFichaSolicitacaoServico(FichaSolicitacaoServico persistentObject) {
        fichaSolicitacaoServicoServiceInterface.deleteFichaSolicitacaoServico(persistentObject);
    }

    public void deleteFichaSolicitacaoServico(long id) {
        fichaSolicitacaoServicoServiceInterface.deleteFichaSolicitacaoServico(id);
    }

    // Foto--------------------------------------------------------------

    @Autowired

    private FotoServiceInterface fotoServiceInterface;

    public Foto saveFoto(Foto newInstance) {
        return fotoServiceInterface.saveFoto(newInstance);
    }

    public Foto updateFoto(Foto transientObject) {
        return fotoServiceInterface.updateFoto(transientObject);
    }

    public Foto findFotoById(Long id) {
        return fotoServiceInterface.findFotoById(id);
    }

    public List<Foto> getAllFoto() {
        return fotoServiceInterface.getAllFoto();
    }

    public void deleteFoto(Foto persistentObject) {
        fotoServiceInterface.deleteFoto(persistentObject);
    }

    public void deleteFoto(long id) {
        fotoServiceInterface.deleteFoto(id);
    }

    // Instituicao--------------------------------------------------------------

    @Autowired
    private InstituicaoServiceInterface instituicaoServiceInterface;

    public Instituicao saveInstituicao(Instituicao newInstance) {
        return instituicaoServiceInterface.saveInstituicao(newInstance);
    }

    public Instituicao updateInstituicao(Instituicao transientObject) {
        return instituicaoServiceInterface.updateInstituicao(transientObject);
    }

    public Instituicao findInstituicaoById(long id) {
        return instituicaoServiceInterface.findInstituicaoById(id);
    }

    public List<Instituicao> getAllInstituicao() {
        return instituicaoServiceInterface.getAllInstituicao();
    }

    public void deleteInstituicao(Instituicao persistentObject) {
        instituicaoServiceInterface.deleteInstituicao(persistentObject);
    }

    public void deleteInstituicao(long id) {
        instituicaoServiceInterface.deleteInstituicao(id);
    }


    // LaudoNecropsia--------------------------------------------------------------
    @Autowired
    private LaudoNecropsiaServiceInterface laudoNecropsiaServiceInterfcae;

    public LaudoNecropsia saveLaudoNecropsia(LaudoNecropsia newInstance) {
        return laudoNecropsiaServiceInterfcae.saveLaudoNecropsia(newInstance);
    }

    public LaudoNecropsia updateLaudoNecropsia(LaudoNecropsia transientObject) {
        return laudoNecropsiaServiceInterfcae.updateLaudoNecropsia(transientObject);
    }

    public LaudoNecropsia findLaudoNecropsiaById(long id) {
        return laudoNecropsiaServiceInterfcae.findLaudoNecropsiaById(id);
    }

    public List<LaudoNecropsia> getAllLaudoNecropsia() {
        return laudoNecropsiaServiceInterfcae.getAllLaudoNecropsia();
    }

    public void deleteLaudoNecropsia(LaudoNecropsia persistentObject) {
        laudoNecropsiaServiceInterfcae.deleteLaudoNecropsia(persistentObject);
    }

    public void deleteLaudoNecropsia(long id) {
        laudoNecropsiaServiceInterfcae.deleteLaudoNecropsia(id);
    }

    // MaterialColetado--------------------------------------------------------------
    @Autowired

    private MaterialColetadoServiceInterface materialColetadoServiceInterface;

    public MaterialColetado saveMaterialColetado(MaterialColetado newInstance) {
        return materialColetadoServiceInterface.saveMaterialColetado(newInstance);
    }

    public MaterialColetado updateMaterialColetado(MaterialColetado transientObject) {
        return materialColetadoServiceInterface.updateMaterialColetado(transientObject);
    }

    public MaterialColetado findMaterialColetadoById(long id) {
        return materialColetadoServiceInterface.findMaterialColetadoById(id);
    }

    public List<MaterialColetado> getAllMaterialColetado() {
        return materialColetadoServiceInterface.getAllMaterialColetado();
    }

    public void deleteMaterialColetado(MaterialColetado persistentObject) {
        materialColetadoServiceInterface.deleteMaterialColetado(persistentObject);
    }

    public void deleteMaterialColetado(long id) {
        materialColetadoServiceInterface.deleteMaterialColetado(id);
    }

    // Orgao--------------------------------------------------------------
    @Autowired

    private OrgaoServiceInterface OrgaoServiceInterface;

    public Orgao saveOrgao(Orgao newInstance) {
        return OrgaoServiceInterface.saveOrgao(newInstance);
    }

    public Orgao updateOrgao(Orgao transientObject) {
        return OrgaoServiceInterface.updateOrgao(transientObject);
    }

    public Orgao findOrgaoById(long id) {
        return OrgaoServiceInterface.findOrgaoById(id);
    }

    public List<Orgao> getAllOrgao() {
        return OrgaoServiceInterface.getAllOrgao();
    }

    public void deleteOrgao(Orgao persistentObject) {
        OrgaoServiceInterface.deleteOrgao(persistentObject);
    }

    public void deleteOrgao(long id) {
        OrgaoServiceInterface.deleteOrgao(id);
    }

    // Rotina--------------------------------------------------------------
    @Autowired

    private RotinaServiceInterface RotinaServiceInterface;

    public Rotina saveRotina(Rotina newInstance) {
        return RotinaServiceInterface.saveRotina(newInstance);
    }

    public Rotina updateRotina(Rotina transientObject) {
        return RotinaServiceInterface.updateRotina(transientObject);
    }

    public Rotina findRotinaById(long id) {
        return RotinaServiceInterface.findRotinaById(id);
    }

    public List<Rotina> getAllRotina() {
        return RotinaServiceInterface.getAllRotina();
    }

    public void deleteRotina(Rotina persistentObject) {
        RotinaServiceInterface.deleteRotina(persistentObject);
    }

    public void deleteRotina(long id) {
        RotinaServiceInterface.deleteRotina(id);
    }

    // Arquivo --------------------------------------------------------------

    @Autowired
    private FileServiceInterface fileService;

    public File findFile(String fileName) {
        return fileService.findFile(fileName);
    }

    public String storeFile(InputStream file, String fileName) {
        String fn = System.currentTimeMillis() + "-" + fileName;
        return fileService.storeFile(file, fn.replace(" ", ""));
    }

    public void deleteFile(String fileName) {
        fileService.deleteFile(fileName);
    }

    // CampoLaudoMicroscopia --------------------------------------------------------------

    @Autowired
    private CampoLaudoMicroscopiaServiceInterface campoLaudoMicroscopiaServiceInterface;

    public CampoLaudoMicroscopia saveCampoLaudoMicroscopia(CampoLaudoMicroscopia newInstance) {
        return campoLaudoMicroscopiaServiceInterface.saveCampoLaudoMicroscopia(newInstance);
    }

    public CampoLaudoMicroscopia updateCampoLaudoMicroscopia(CampoLaudoMicroscopia transientObject) {
        return campoLaudoMicroscopiaServiceInterface.updateCampoLaudoMicroscopia(transientObject);
    }

    public CampoLaudoMicroscopia findCampoLaudoMicroscopiaById(Long id) {
        return campoLaudoMicroscopiaServiceInterface.findCampoLaudoMicroscopiaById(id);
    }

    public List<CampoLaudoMicroscopia> getAllCampoLaudoMicroscopia() {
        return campoLaudoMicroscopiaServiceInterface.getAllCampoLaudoMicroscopia();
    }

    public void deleteCampoLaudoMicroscopia(CampoLaudoMicroscopia persistentObject) {
        campoLaudoMicroscopiaServiceInterface.deleteCampoLaudoMicroscopia(persistentObject.getId());
    }

    public void deleteCampoLaudoMicroscopia(long id) {
        campoLaudoMicroscopiaServiceInterface.deleteCampoLaudoMicroscopia(id);
    }
}
