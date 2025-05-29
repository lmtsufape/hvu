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
import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import br.edu.ufape.hvu.controller.dto.request.*;
import br.edu.ufape.hvu.exception.ResourceNotFoundException;
import br.edu.ufape.hvu.exception.types.auth.ForbiddenOperationException;
import lombok.RequiredArgsConstructor;
import br.edu.ufape.hvu.model.enums.StatusAgendamentoEVaga;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.service.*;
import jakarta.transaction.Transactional;

@Service @RequiredArgsConstructor
public class Facade {
    // ModelMapper
    private final ModelMapper modelMapper;

    // Auth--------------------------------------------------------------
    private final KeycloakService keycloakService;
    @Autowired
    private MedicoServiceInterface medicoServiceInterface;

    public TokenResponse login(String username, String password) {
        return keycloakService.login(username, password);
    }

    public TokenResponse refresh(String refreshToken) {
        return keycloakService.refreshToken(refreshToken);
    }

    public void forgetPassword(String email) {keycloakService.sendResetPasswordEmail(email);}

    // Tutor--------------------------------------------------------------

    private final TutorServiceInterface tutorServiceInterface;

    @Transactional
    public Tutor saveTutor(Tutor newInstance, String password) throws ResponseStatusException {
        tutorServiceInterface.verificarDuplicidade(newInstance.getCpf(), newInstance.getEmail());
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
    public Tutor updateTutor(Long id, TutorRequest request, String idSession) {
        Tutor tutor = findTutorById(id, idSession); // já faz a verificação de acesso

        // Mapeamento e atualização
        Tutor updatedFields = request.convertToEntity();

        modelMapper.typeMap(Tutor.class, Tutor.class)
                .addMappings(mapper -> mapper.skip(Tutor::setId))
                .map(updatedFields, tutor);

        try {
            Tutor newTutor = tutorServiceInterface.updateTutor(tutor);
            keycloakService.updateUser(newTutor.getUserId(), newTutor.getEmail());
            return newTutor;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar o usuário: " + e.getMessage());
        }
    }

    public Tutor findTutorById(long id, String idSession) {
        Tutor tutor = tutorServiceInterface.findTutorById(id);

        if(!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession) && !tutor.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem permição de acessar esse tutor ou alterar os dados do mesmo.");
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

    @Transactional
    public void deleteTutor(long id, String idSession) {
        Tutor oldObject = findTutorById(id, idSession);

        if(!keycloakService.hasRoleSecretario(idSession) && !oldObject.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem permição de acessar esse tutor ou alterar os dados do mesmo.");
        }

        try {
            tutorServiceInterface.deleteTutor(id);
            keycloakService.deleteUser(idSession);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting user");
        }
    }

    // Cancelamento--------------------------------------------------------------
    private final CancelamentoServiceInterface cancelamentoServiceInterface;

    @Transactional
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

    @Transactional
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

    @Transactional
    public Cancelamento updateCancelamento(Long id, CancelamentoRequest obj) {

        Cancelamento oldObject = findCancelamentoById(id);

        // Verifica se há uma nova especialidade e busca no banco
        if (obj.getEspecialidade() != null) {
            oldObject.setEspecialidade(findEspecialidadeById(obj.getEspecialidade().getId()));
            obj.setEspecialidade(null); // evita sobrescrita ao mapear
        }

        // Mapeamento parcial (sem sobrescrever o ID)
        TypeMap<CancelamentoRequest, Cancelamento> typeMapper = modelMapper
                .typeMap(CancelamentoRequest.class, Cancelamento.class)
                .addMappings(mapper -> mapper.skip(Cancelamento::setId));

        typeMapper.map(obj, oldObject);

        return cancelamentoServiceInterface.updateCancelamento(oldObject);
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

    public void deleteCancelamento(long id) {
        cancelamentoServiceInterface.deleteCancelamento(id);
    }

    // TipoConsulta--------------------------------------------------------------
    private final TipoConsultaServiceInterface tipoConsultaServiceInterface;

    @Transactional
    public TipoConsulta saveTipoConsulta(TipoConsulta newInstance) {
        return tipoConsultaServiceInterface.saveTipoConsulta(newInstance);
    }

    @Transactional
    public TipoConsulta updateTipoConsulta(Long id, TipoConsultaRequest transientObject) {


        //TipoConsulta o = obj.convertToEntity();
        TipoConsulta oldObject = findTipoConsultaById(id);
        TipoConsulta obj = transientObject.convertToEntity();

        TypeMap<TipoConsulta, TipoConsulta> typeMapper = modelMapper
                .typeMap(TipoConsulta.class, TipoConsulta.class)
                .addMappings(mapper -> mapper.skip(TipoConsulta::setId));


        typeMapper.map(obj, oldObject);

        return tipoConsultaServiceInterface.updateTipoConsulta(oldObject);
    }

    public TipoConsulta findTipoConsultaById(long id) {
        return tipoConsultaServiceInterface.findTipoConsultaById(id);
    }

    public List<TipoConsulta> getAllTipoConsulta() {
        return tipoConsultaServiceInterface.getAllTipoConsulta();
    }

    public void deleteTipoConsulta(long id) {
        tipoConsultaServiceInterface.deleteTipoConsulta(id);
    }

    // Usuario--------------------------------------------------------------
    private final UsuarioServiceInterface usuarioServiceInterface;

    public Usuario saveUsuario(Usuario newInstance) {
        if(newInstance == null) {
            throw new IllegalArgumentException("Usuario não pode ser nulo");
        }

        return usuarioServiceInterface.saveUsuario(newInstance);
    }

    @Transactional
    public Usuario updateUsuario(long id, UsuarioRequest request, String idSession) {
        if (request == null || idSession == null || idSession.isBlank()) {
            throw new IllegalArgumentException("Usuário ou ID da sessão inválidos.");
        }

        Usuario usuarioAtualizado = request.convertToEntity();
        Usuario usuarioExistente = usuarioServiceInterface.findUsuarioById(id, idSession);

        modelMapper.typeMap(Usuario.class, Usuario.class)
                .addMappings(mapper -> mapper.skip(Usuario::setId))
                .map(usuarioAtualizado, usuarioExistente);

        try {
            Usuario newUsuario = usuarioServiceInterface.updateUsuario(usuarioExistente, idSession);
            keycloakService.updateUser(newUsuario.getUserId(), newUsuario.getEmail());
            return newUsuario;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar o usuário: " + e.getMessage());
        }
    }

    public Usuario findUsuarioById(long id, String idSession) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID do usuário inválido.");
        }
        return usuarioServiceInterface.findUsuarioById(id, idSession);
    }

    public Usuario findUsuarioByuserId(String userId) throws IdNotFoundException {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId não pode ser vazio.");
        }
        return usuarioServiceInterface.findUsuarioByuserId(userId);
    }

    public List<Usuario> getAllUsuario() {
        return usuarioServiceInterface.getAllUsuario();
    }

    public void deleteUsuario(long id) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido para exclusão.");
        }
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

    public List<Cronograma> findCronogramaByMedicoId(long id, String idSession){
        Medico medico = findMedicoById(id, idSession);
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
    public Medico saveMedico(MedicoRequest request, String password) {
        Medico medico = request.convertToEntity();
        String userKcId = null;
        keycloakService.createUser(medico.getCpf(), medico.getEmail(), password, "medico");
        try {
            userKcId = keycloakService.getUserId(medico.getEmail());
            medico.setUserId(userKcId);
            return medicoService.saveMedico(medico);
        }catch (DataIntegrityViolationException e){
            keycloakService.deleteUser(userKcId);
            throw e;
        }catch (Exception e){
            keycloakService.deleteUser(userKcId);
            throw new RuntimeException("Ocorreu um erro inesperado ao salvar o usuário: "+ e.getMessage(), e);
        }
    }

    @Transactional
    public Medico updateMedico(Long id, MedicoRequest request, String idSession) {
        if (request == null) {
            throw new IllegalArgumentException("Dados inválidos para atualização.");
        }

        Medico oldMedico = medicoService.findMedicoById(id); // lança EntityNotFoundException se não existir
        Medico medicoAtualizado = request.convertToEntity();

        if(!keycloakService.hasRoleSecretario(idSession) && !medicoAtualizado.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse medico ou alterar os dados do mesmo.");
        }

        // Atualiza instituição, se necessário
        if (request.getInstituicao() != null) {
            oldMedico.setInstituicao(findInstituicaoById(request.getInstituicao().getId()));
        }

        modelMapper.typeMap(Medico.class, Medico.class)
                .addMappings(mapper -> mapper.skip(Medico::setId))
                .map(medicoAtualizado, oldMedico);


        Medico newMedico = medicoService.updateMedico(oldMedico);
        keycloakService.updateUser(newMedico.getUserId(), newMedico.getEmail());
        return newMedico;
    }

    public Medico findMedicoById(long id, String idSession) {
        Medico medico = medicoService.findMedicoById(id);
        if(!keycloakService.hasRoleSecretario(idSession) && !medico.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse medico ou alterar os dados do mesmo.");
        }
        return medicoService.findMedicoById(id);
    }

    public List<Medico> getAllMedico() {
        return medicoService.getAllMedico();
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

    // Aviso--------------------------------------------------------------
    private final AvisoServiceInterface avisoServiceInterface;

    public Aviso saveAviso(Aviso newInstance) {
        return avisoServiceInterface.saveAviso(newInstance);
    }

    @Transactional
    public Aviso updateAviso(AvisoRequest transientObject, Long id) {
        //Aviso o = obj.convertToEntity();
        Aviso oldObject = avisoServiceInterface.findAvisoById(id);

        TypeMap<AvisoRequest, Aviso> typeMapper = modelMapper
                .typeMap(AvisoRequest.class, Aviso.class)
                .addMappings(mapper -> mapper.skip(Aviso::setId));

        typeMapper.map(transientObject, oldObject);


        return avisoServiceInterface.updateAviso(oldObject);
    }

    public Aviso findAvisoById(long id) {
        return avisoServiceInterface.findAvisoById(id);
    }

    public List<Aviso> getAllAviso() {
        return avisoServiceInterface.getAllAviso();
    }

    public void deleteAviso(Aviso persistentObject) {
        avisoServiceInterface.deleteAviso(persistentObject);
    }

    public void deleteAviso(long id) {
        avisoServiceInterface.deleteAviso(id);
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

    public Vaga processUpdateVaga(VagaRequest obj, Long id, String idSession){
        //Vaga o = obj.convertToEntity();
        Vaga oldObject = vagaServiceInterface.findVagaById(id);

        if (obj.getTipoConsulta() != null) {
            oldObject.setTipoConsulta(tipoConsultaServiceInterface.findTipoConsultaById(obj.getTipoConsulta().getId()));
            obj.setTipoConsulta(null);
        }

        if (obj.getEspecialidade() != null) {
            oldObject.setEspecialidade(especialidadeServiceInterface.findEspecialidadeById(obj.getEspecialidade().getId()));
            obj.setEspecialidade(null);
        }

        if(obj.getMedico() != null){
            oldObject.setMedico(medicoServiceInterface.findMedicoById(obj.getMedico().getId()));
            obj.setMedico(null);
        }

        TypeMap<VagaRequest, Vaga> typeMapper = modelMapper
                .typeMap(VagaRequest.class, Vaga.class)
                .addMappings(mapper -> mapper.skip(Vaga::setId));

        typeMapper.map(obj, oldObject);
        return updateVaga(oldObject);
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


    public List<Vaga> findVagasAndAgendamentoByMedico (LocalDate data, Long IdMedico, String idSession){
        Medico medico = findMedicoById(IdMedico, idSession);

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

        if (ultimaVaga == null) {
            return true;
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
        if(animal == null){
            throw new IdNotFoundException(id, "Animal");
        }
        boolean consultaEmAberto = allAgendamentos.stream()
                .anyMatch(agendamento -> agendamento.getAnimal() != null &&
                        agendamento.getAnimal().getId() == animal.getId() &&
                        !agendamento.getStatus().equals("Finalizado") && !agendamento.getStatus().equals("Cancelado"));

        if(consultaEmAberto){
            return "Bloqueado";
        }else if(isAnimalWithRetorno(animal.getId()) || !isRetornoExpirado(animal.getId())){
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
    public String createVagasByTurno(VagaCreateRequest vagaRequestDTO, String idSessio) {
        List<Vaga> vagas = new ArrayList<>();
        LocalDate startDate = vagaRequestDTO.getData();
        LocalDate endDate = vagaRequestDTO.getDataFinal();
        final long[] countCriacao = new long[2]; // countCriacao[0] quantidade criada, countCriacao[1] nao criada
        StringBuilder detalheBuilder = new StringBuilder();

        if (endDate == null) {
            if (!isWeekend(startDate)) {
                detalheBuilder.append(createVagas(startDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao, idSessio));
                detalheBuilder.append(" ").append(createVagas(startDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao, idSessio));
            }
        } else {
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                if (!isWeekend(currentDate)) {
                    detalheBuilder.append(createVagas(currentDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao, idSessio));
                    detalheBuilder.append(" ").append(createVagas(currentDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao, idSessio));
                }
                currentDate = currentDate.plusDays(1);
            }
        }

        return detalheBuilder.toString().trim();
    }

    private boolean isWeekend(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY;
    }

    private String createVagas(LocalDate data, List<VagaTipoRequest> vagaTipo, String turno, List<Vaga> vagas, long[] countCriacao, String idSession) {
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
                Medico medico = findMedicoById(especialidadeTipo.getMedico().getId(), idSession);

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


    // Consulta--------------------------------------------------------------
    @Autowired
    private ConsultaServiceInterface consultaServiceInterface;

    public Consulta saveConsulta(Long id, Consulta newInstance) {
        Vaga vagaDaConsulta = vagaServiceInterface.findVagaById(id);
        Agendamento agendamentoVaga = agendamentoServiceInterface.findAgendamentoById(vagaDaConsulta.getAgendamento().getId());

        Consulta consulta = consultaServiceInterface.saveConsulta(newInstance);
        vagaDaConsulta.setStatus("Finalizado");
        agendamentoVaga.setStatus("Finalizado");

        if (newInstance.getFicha() != null) {
            List<Ficha> fichas = new ArrayList<>();

            for (Ficha f : newInstance.getFicha()) {
                Ficha fichaBuscada = fichaServiceInterface.findFichaById(f.getId());
                fichas.add(fichaBuscada);
            }

            consulta.setFicha(fichas);
        }

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
    private final AgendamentoServiceInterface agendamentoServiceInterface;

    @Transactional
    public Agendamento saveAgendamento(AgendamentoRequest newInstance, Long idVaga, String idSession) {
        Animal animal = findAnimalById(newInstance.getAnimal().getId(), idSession);
        Vaga vaga = findVagaById(idVaga);

        // Validações adicionais aqui, se necessário (ex: se a vaga está no futuro, etc.)

        Agendamento agendamento = newInstance.convertToEntity();
        agendamento.setAnimal(animal);
        return confirmarAgendamento(vaga, agendamento);
    }

    @Transactional
    public Agendamento createAgendamentoEspecial(AgendamentoEspecialRequest newObject, String idSession) {
        Vaga vaga = new Vaga();
        Agendamento agendamento = new Agendamento();

        vaga.setEspecialidade(findEspecialidadeById(newObject.getEspecialidade().getId()));
        vaga.setMedico(findMedicoById(newObject.getMedico().getId(), idSession));
        vaga.setTipoConsulta(findTipoConsultaById(newObject.getTipoConsulta().getId()));
        vaga.setDataHora(newObject.getHorario());

        saveVaga(vaga);

        agendamento.setAnimal(findAnimalById(newObject.getAnimal().getId(), idSession));
        agendamento.setTipoEspecial(newObject.isTipoEspecial());

        return confirmarAgendamento(vaga, agendamento);
    }


    private Agendamento confirmarAgendamento(Vaga vaga, Agendamento agendamento) {
        if (vaga.getAgendamento() != null ){
            throw new IllegalStateException("A vaga não está disponível.");
        }

        vaga.setStatus("Agendado");
        vaga.setAgendamento(agendamento);
        agendamento.setDataVaga(vaga.getDataHora());
        agendamento.setStatus(vaga.getStatus());

        return agendamentoServiceInterface.saveAgendamento(agendamento);
    }

    public Agendamento updateAgendamento(Agendamento transientObject) {
        return agendamentoServiceInterface.updateAgendamento(transientObject);
    }

    @Transactional
    public Agendamento processUpdateAgendamento(AgendamentoRequest transientObject, Long id, String userId) {

        Agendamento oldObject = findAgendamentoById(id);

        if (transientObject.getAnimal() != null) {
            oldObject.setAnimal(findAnimalById(transientObject.getAnimal().getId(), userId));
            transientObject.setAnimal(null);
        }

        TypeMap<AgendamentoRequest, Agendamento> typeMapper = modelMapper
                .typeMap(AgendamentoRequest.class, Agendamento.class)
                .addMappings(mapper -> mapper.skip(Agendamento::setId));

        typeMapper.map(transientObject, oldObject);

        return updateAgendamento(oldObject);
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

    public List<Agendamento> findAgendamentosByMedicoId(Long medicoId, String idSession){
        Medico medico = findMedicoById(medicoId, idSession);
        return agendamentoServiceInterface.findAgendamentosByMedicoId(medico, idSession);
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

    public Estagiario updateEstagiario(EstagiarioRequest obj, Long id) {
        //Estagiario o = obj.convertToEntity();
        Estagiario oldObject = findEstagiarioById(id);

        TypeMap<EstagiarioRequest, Estagiario> typeMapper = modelMapper
                .typeMap(EstagiarioRequest.class, Estagiario.class)
                .addMappings(mapper -> mapper.skip(Estagiario::setId));


        typeMapper.map(obj, oldObject);
        return estagiarioServiceInterface.updateEstagiario(oldObject);
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
    private final AnimalServiceInterface animalServiceInterface;

    public Animal saveAnimal(Animal newInstance, String idSession) {
        Tutor tutor = findTutorByuserId(idSession);
        if (tutor == null) {
            throw new ResourceNotFoundException("Tutor", "o idSession ", idSession);
        }
        racaServiceInterface.findRacaById(newInstance.getRaca().getId());
        Animal animal = animalServiceInterface.saveAnimal(newInstance);
        tutor.getAnimal().add(animal);
        tutorServiceInterface.updateTutor(tutor);
        return animal;
    }

    public Animal updateAnimal(Long id, AnimalRequest request, String idSession) {
        Animal animal = animalServiceInterface.findAnimalById(id);
        Tutor tutor = tutorServiceInterface.findTutorByanimalId(animal.getId());

        if (!keycloakService.hasRoleSecretario(idSession) &&
                !keycloakService.hasRoleMedico(idSession) &&
                !tutor.getUserId().equals(idSession)) {
            throw new ForbiddenOperationException("Este não é o seu animal");
        }

        // Atualiza raça, se fornecida
        if (request.getRaca() != null) {
            animal.setRaca(racaServiceInterface.findRacaById(request.getRaca().getId()));
            request.setRaca(null);
        }

        // Mapeia os campos restantes
        modelMapper.typeMap(AnimalRequest.class, Animal.class)
                .addMappings(mapper -> mapper.skip(Animal::setId))
                .map(request, animal);

        return animalServiceInterface.updateAnimal(animal);
    }

    public Animal findAnimalById(long id, String idSession) {
        // caso não seja um secretario ou medico, verifica se o animal pertece ao tutor de fato
        if(!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession)){
            Tutor tutor = tutorServiceInterface.findTutorByanimalId(id);

            if(!tutor.getUserId().equals(idSession)) {
                throw new ForbiddenOperationException("Este não é o seu animal");
            }
        }
        return animalServiceInterface.findAnimalById(id);
    }

    public List<Animal> getAllAnimal() {
        return animalServiceInterface.getAllAnimal();
    }

    public List<Animal> getAllAnimalTutor(String userId) {
        Tutor tutor = findTutorByuserId(userId);
        return tutor.getAnimal();
    }

    public Animal getAnimalByFichaNumber(String fichaNumero){
        return animalServiceInterface.findAnimalByFichaNumber(fichaNumero);
    }

    public void deleteAnimal(long id, String userId) {
        // caso não seja um secretario ou medico, verifica se o animal pertece ao tutor de fato
        if(!keycloakService.hasRoleSecretario(userId) && !keycloakService.hasRoleMedico(userId)){
            Tutor tutor = tutorServiceInterface.findTutorByanimalId(id);

            if(!tutor.getUserId().equals(userId)) {
                throw new ForbiddenOperationException("Este não é o seu animal");
            }
        }

        animalServiceInterface.deleteAnimal(id);
    }

    // Especie--------------------------------------------------------------
    @Autowired
    private EspecieServiceInterface especieServiceInterface;

    public Especie saveEspecie(Especie newInstance) {
        return especieServiceInterface.saveEspecie(newInstance);
    }

    public Especie updateEspecie(EspecieRequest obj, Long id) {
        //Especie o = obj.convertToEntity();
        Especie oldObject = findEspecieById(id);

        TypeMap<EspecieRequest, Especie> typeMapper = modelMapper
                .typeMap(EspecieRequest.class, Especie.class)
                .addMappings(mapper -> mapper.skip(Especie::setId));


        typeMapper.map(obj, oldObject);
        return especieServiceInterface.updateEspecie(oldObject);
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

    // Area--------------------------------------------------------------
    private final AreaServiceInterface areaServiceInterface;

    public Area saveArea(Area newInstance) {
        return areaServiceInterface.saveArea(newInstance);
    }

    public Area updateArea(AreaRequest transientObject, Long id) {
        //Area o = obj.convertToEntity();
        Area oldObject = findAreaById(id);

        TypeMap<AreaRequest, Area> typeMapper = modelMapper
                .typeMap(AreaRequest.class, Area.class)
                .addMappings(mapper -> mapper.skip(Area::setId));

        typeMapper.map(transientObject, oldObject);
        return areaServiceInterface.updateArea(oldObject);
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
    private final CampoLaudoServiceInterface campoLaudoServiceInterface;

    public CampoLaudo saveCampoLaudo(CampoLaudo newInstance) {
        return campoLaudoServiceInterface.saveCampoLaudo(newInstance);
    }

    public CampoLaudo updateCampoLaudo(CampoLaudoRequest transientObject, Long id) {

        //CampoLaudo o = obj.convertToEntity();
        CampoLaudo oldObject = campoLaudoServiceInterface.findCampoLaudoById(id);

        TypeMap<CampoLaudoRequest, CampoLaudo> typeMapper = modelMapper
                .typeMap(CampoLaudoRequest.class, CampoLaudo.class)
                .addMappings(mapper -> mapper.skip(CampoLaudo::setId));


        typeMapper.map(transientObject, oldObject);

        return campoLaudoServiceInterface.updateCampoLaudo(oldObject);
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

    public Etapa updateEtapa(EtapaRequest obj, Long id) {
        //Etapa o = obj.convertToEntity();
        Etapa oldObject = findEtapaById(id);

        TypeMap<EtapaRequest, Etapa> typeMapper = modelMapper
                .typeMap(EtapaRequest.class, Etapa.class)
                .addMappings(mapper -> mapper.skip(Etapa::setId));


        typeMapper.map(obj, oldObject);
        return etapaServiceInterface.updateEtapa(oldObject);
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

    // Ficha--------------------------------------------------------------

    @Autowired
    private FichaServiceInterface fichaServiceInterface;

    public Ficha saveFicha(Ficha newInstance) {
        return fichaServiceInterface.saveFicha(newInstance);
    }

    public Ficha updateFicha(FichaRequest obj, Long id) {

        //Ficha o = obj.convertToEntity();
        Ficha oldObject = findFichaById(id);
        TypeMap<FichaRequest, Ficha> typeMapper = modelMapper
                .typeMap(FichaRequest.class, Ficha.class)
                .addMappings(mapper -> mapper.skip(Ficha::setId));
        typeMapper.map(obj, oldObject);

        return fichaServiceInterface.updateFicha(oldObject);
    }

    public Ficha findFichaById(long id) {
        return fichaServiceInterface.findFichaById(id);
    }

    public List<Ficha> getAllFicha() {
        return fichaServiceInterface.getAllFicha();
    }

    public void deleteFicha(Ficha persistentObject) {
        fichaServiceInterface.deleteFicha(persistentObject);
    }

    public void deleteFicha(long id) {
        fichaServiceInterface.deleteFicha(id);
    }

    // FichaSolicitacaoServico--------------------------------------------------------------

    @Autowired
    private FichaSolicitacaoServicoServiceInterface fichaSolicitacaoServicoServiceInterface;

    public FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico newInstance) {
        return fichaSolicitacaoServicoServiceInterface.saveFichaSolicitacaoServico(newInstance);
    }

    @Transactional
    public FichaSolicitacaoServico updateFichaSolicitacaoServico(FichaSolicitacaoServicoRequest obj, Long id, String idSession) {
        //FichaSolicitacaoServico o = obj.convertToEntity();
        FichaSolicitacaoServico oldObject = findFichaSolicitacaoServicoById(id);

        if(obj.getMedico() != null){
            oldObject.setMedico(findMedicoById(obj.getMedico().getId(), idSession));
            obj.setMedico(null);
        }


        TypeMap<FichaSolicitacaoServicoRequest, FichaSolicitacaoServico> typeMapper = modelMapper
                .typeMap(FichaSolicitacaoServicoRequest.class, FichaSolicitacaoServico.class)
                .addMappings(mapper -> mapper.skip(FichaSolicitacaoServico::setId));


        typeMapper.map(obj, oldObject);

        return fichaSolicitacaoServicoServiceInterface.updateFichaSolicitacaoServico(oldObject);
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

    public Foto updateFoto(FotoRequest obj, Long id) {
        //Foto o = obj.convertToEntity();
        Foto oldObject = findFotoById(id);

        TypeMap<FotoRequest, Foto> typeMapper = modelMapper
                .typeMap(FotoRequest.class, Foto.class)
                .addMappings(mapper -> mapper.skip(Foto::setId));


        typeMapper.map(obj, oldObject);

        return fotoServiceInterface.updateFoto(oldObject);
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

    public Instituicao updateInstituicao(InstituicaoRequest obj, Long id) {

        //Instituicao o = obj.convertToEntity();
        Instituicao oldObject = findInstituicaoById(id);

        TypeMap<InstituicaoRequest, Instituicao> typeMapper = modelMapper
                .typeMap(InstituicaoRequest.class, Instituicao.class)
                .addMappings(mapper -> mapper.skip(Instituicao::setId));


        typeMapper.map(obj, oldObject);


        return instituicaoServiceInterface.updateInstituicao(oldObject);
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

    @Transactional
    public LaudoNecropsia updateLaudoNecropsia(LaudoNecropsiaRequest obj, Long id) {
        LaudoNecropsia oldObject = laudoNecropsiaServiceInterfcae.findLaudoNecropsiaById(id);

        // campoLaudo
        if(obj.getCampoLaudo() != null && !obj.getCampoLaudo().isEmpty()){
            List<CampoLaudo> updatedCampoLaudos = obj.getCampoLaudo().stream()
                    .map(campo -> findCampoLaudoById(campo.getId()))
                    .collect(Collectors.toList());
            oldObject.setCampoLaudo(updatedCampoLaudos);
            obj.setCampoLaudo(null); // Limpar para evitar mapeamento duplo
        }

        TypeMap<LaudoNecropsiaRequest, LaudoNecropsia> typeMapper = modelMapper
                .typeMap(LaudoNecropsiaRequest.class, LaudoNecropsia.class)
                .addMappings(mapper -> mapper.skip(LaudoNecropsia::setId));

        typeMapper.map(obj, oldObject);

        return laudoNecropsiaServiceInterfcae.updateLaudoNecropsia(oldObject);
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

    public MaterialColetado updateMaterialColetado(MaterialColetadoRequest obj, Long id) {
        //MaterialColetado o = obj.convertToEntity();
        MaterialColetado oldObject = materialColetadoServiceInterface.findMaterialColetadoById(id);

        TypeMap<MaterialColetadoRequest, MaterialColetado> typeMapper = modelMapper
                .typeMap(MaterialColetadoRequest.class, MaterialColetado.class)
                .addMappings(mapper -> mapper.skip(MaterialColetado::setId));


        typeMapper.map(obj, oldObject);

        return materialColetadoServiceInterface.updateMaterialColetado(oldObject);
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

    public Orgao updateOrgao(OrgaoRequest transientObject, Long id) {
        //Orgao o = obj.convertToEntity();
        Orgao oldObject = OrgaoServiceInterface.findOrgaoById(id);


        TypeMap<OrgaoRequest, Orgao> typeMapper = modelMapper
                .typeMap(OrgaoRequest.class, Orgao.class)
                .addMappings(mapper -> mapper.skip(Orgao::setId));


        typeMapper.map(transientObject, oldObject);

        return OrgaoServiceInterface.updateOrgao(oldObject);
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
