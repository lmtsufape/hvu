package br.edu.ufape.hvu.facade;

import java.io.File;
import java.io.InputStream;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import br.edu.ufape.hvu.controller.dto.auth.TokenResponse;
import br.edu.ufape.hvu.controller.dto.request.*;
import br.edu.ufape.hvu.exception.OrigemAnimalInvalidaException;
import br.edu.ufape.hvu.exception.ResourceNotFoundException;
import br.edu.ufape.hvu.exception.types.BusinessException;
import br.edu.ufape.hvu.exception.types.auth.ForbiddenOperationException;
import br.edu.ufape.hvu.model.enums.TipoServico;
import br.edu.ufape.hvu.repository.AgendamentoRepository;
import br.edu.ufape.hvu.model.enums.OrigemAnimal;
import br.edu.ufape.hvu.repository.AnimalRepository;
import br.edu.ufape.hvu.repository.OrgaoRepository;
import lombok.RequiredArgsConstructor;
import br.edu.ufape.hvu.model.enums.StatusAgendamentoEVaga;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
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
        if (newInstance.isAnonimo()) {
            throw new RuntimeException("Não é permitido salvar um tutor como anônimo por este método.");
        }

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
        if (keycloakService.hasRoleSecretario(idSession) || keycloakService.hasRolePatologista(idSession)) {
            return tutorServiceInterface.findTutorById(id);
        }

        Tutor tutor = tutorServiceInterface.findTutorById(id);
        if (!tutor.getUserId().equals(idSession)) {
            throw new ForbiddenOperationException("Você não é responsável por este animal");
        }

        return tutor;
    }

    public Tutor findTutorByUserId(String userId) {
        return tutorServiceInterface.findTutorByUserId(userId);
    }

    public Tutor findTutorByanimalId(Long animalId, String idSession) {
        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = medicoServiceInterface.findByUserId(idSession);

            boolean autorizado = existsVagaByMedicoIdAndAnimalId(medico.getId(), animalId);
            if (!autorizado) {
                throw new ForbiddenOperationException("Este animal não está agendado com o médico logado.");
            }
        }

        return tutorServiceInterface.findTutorByAnimalId(animalId);
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
    public Cancelamento cancelarAgendamento(Cancelamento newInstance, String idSession) {
        Agendamento agendamento = findAgendamentoById(newInstance.getAgendamento().getId(), idSession);
        agendamento.setStatus("Cancelado");

        Vaga vaga = getVagaByAgendamento(agendamento.getId(), idSession);
        vaga.setStatus("Disponivel");
        vaga.setAgendamento(null);

        newInstance.setDataVaga(vaga.getDataHora());
        newInstance.setEspecialidade(vaga.getEspecialidade());
        newInstance.setDataCancelamento(LocalDateTime.now());
        return cancelamentoServiceInterface.saveCancelamento(newInstance);
    }

    @Transactional
    public Cancelamento cancelarVaga(Cancelamento newInstance, String idSession) {
        Vaga vaga = findVagaById(newInstance.getVaga().getId(), idSession);
        vaga.setStatus("Cancelado");
        if(vaga.getAgendamento() != null) {
            Agendamento agendamento = findAgendamentoById(vaga.getAgendamento().getId(), idSession);
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

    @Transactional
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
        TipoConsulta oldObject = findTipoConsultaById(id);

        if (transientObject.getTipo() != null) {
            oldObject.setTipo(transientObject.getTipo());
        }

        return tipoConsultaServiceInterface.updateTipoConsulta(oldObject);
    }

    public TipoConsulta findTipoConsultaById(long id) {
        return tipoConsultaServiceInterface.findTipoConsultaById(id);
    }

    public List<TipoConsulta> getAllTipoConsulta() {
        return tipoConsultaServiceInterface.getAllTipoConsulta();
    }

    @Transactional
    public void deleteTipoConsulta(long id) {
        tipoConsultaServiceInterface.deleteTipoConsulta(id);
    }

    // Usuario--------------------------------------------------------------
    private final UsuarioServiceInterface usuarioServiceInterface;

    @Transactional
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

        // Valida autorização
        Usuario usuarioExistente = findUsuarioById(id, idSession);

        Usuario usuarioAtualizado = request.convertToEntity();
        modelMapper.typeMap(Usuario.class, Usuario.class)
                .addMappings(mapper -> mapper.skip(Usuario::setId))
                .map(usuarioAtualizado, usuarioExistente);

        Usuario newUsuario = usuarioServiceInterface.updateUsuario(usuarioExistente, idSession);
        keycloakService.updateUser(newUsuario.getUserId(), newUsuario.getEmail());

        return newUsuario;
    }

    public Usuario findUsuarioById(long id, String idSession) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID do usuário inválido.");
        }

        Usuario usuario = usuarioServiceInterface.findUsuarioById(id);
        if (usuario.getUserId().equals(idSession)) {
            return usuario;
        }

        if (keycloakService.hasRoleSecretario(idSession)) {
            if (usuario instanceof Medico || usuario instanceof Tutor) {
                return usuario;
            }
        } else if (keycloakService.hasRoleAdminLapa(idSession) && usuario instanceof Patologista) {
            return usuario;
        }

        throw new ForbiddenOperationException("Você não tem acesso para visualizar este usuário.");
    }

    public Usuario findUsuarioByUserId(String userId) throws IdNotFoundException {
        if (userId == null || userId.isBlank()) {
            throw new IllegalArgumentException("userId não pode ser vazio.");
        }
        return usuarioServiceInterface.findUsuarioByUserId(userId);
    }

    @Transactional
    public void deleteUsuario(long id, String idSession) {
        if (id <= 0) {
            throw new IllegalArgumentException("ID inválido para exclusão.");
        }

        Usuario usuario = usuarioServiceInterface.findUsuarioById(id);
        boolean podeExcluir = false;

        if (keycloakService.hasRoleSecretario(idSession)) {
            if (usuario.getUserId().equals(idSession) || usuario instanceof Medico || usuario instanceof Tutor) {
                podeExcluir = true;
            }
        }
        else if (keycloakService.hasRoleAdminLapa(idSession) && (usuario.getUserId().equals(idSession) || usuario instanceof Patologista)) {
            podeExcluir = true;
        }

        if (!podeExcluir) {
            throw new ForbiddenOperationException("Você não tem permissão para excluir este usuário.");
        }
        usuarioServiceInterface.deleteUsuario(id);
    }

    // Cronograma--------------------------------------------------------------
    private final CronogramaServiceInterface cronogramaServiceInterface;

    @Transactional
    public Cronograma saveCronograma(Cronograma newInstance) {
        return cronogramaServiceInterface.saveCronograma(newInstance);
    }

    @Transactional
    public Cronograma updateCronograma(CronogramaRequest obj, Long id, String idSession) {
        Cronograma oldObject = findCronogramaById(id);

        // medico
        if(obj.getMedico() != null){
            oldObject.setMedico(findMedicoById(obj.getMedico().getId(), idSession));
            obj.setMedico(null);
        }

        if (obj.getEspecialidade() != null) {
            oldObject.setEspecialidade(findEspecialidadeById(obj.getEspecialidade().getId()));
            obj.setEspecialidade(null);
        }

        TypeMap<CronogramaRequest, Cronograma> typeMapper = modelMapper
                .typeMap(CronogramaRequest.class, Cronograma.class)
                .addMappings(mapper -> mapper.skip(Cronograma::setId));

        typeMapper.map(obj, oldObject);
        return cronogramaServiceInterface.updateCronograma(oldObject);
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

    @Transactional
    public void deleteCronograma(long cronogramaId) {
        Cronograma cronograma = findCronogramaById(cronogramaId);
        cronogramaServiceInterface.deleteCronograma(cronograma.getId());
    }

    // Medico--------------------------------------------------------------

    private final MedicoServiceInterface medicoService;
    private final MedicoServiceInterface medicoServiceInterface;

    @Transactional
    public Medico saveMedico(MedicoRequest medicoRequest, String password) {
        Medico medico = medicoRequest.convertToEntity();

        if (medicoRequest.getEspecialidade() != null) {
            List<Especialidade> especialidades = new ArrayList<>(
                    medicoRequest.getEspecialidade().stream()
                            .map(especialidadeRequest -> especialidadeServiceInterface.findEspecialidadeById(especialidadeRequest.getId()))
                            .toList()
            );
            medico.setEspecialidade(especialidades);
        }

        medico = medicoService.saveMedico(medico);

        try {
            keycloakService.createUser(medico.getCpf(), medico.getEmail(), password, "medico");
            String userKcId = keycloakService.getUserId(medico.getEmail());

            medico.setUserId(userKcId);
            return medicoService.saveMedico(medico);

        } catch (Exception exception) {
            medicoService.deleteMedico(medico.getId());
            throw new RuntimeException("Erro ao criar usuário no Keycloak: " + exception.getMessage(), exception);
        }
    }

    @Transactional
    public Medico updateMedico(Long id, MedicoRequest request, String idSession) {
        if (request == null) {
            throw new IllegalArgumentException("Dados inválidos para atualização.");
        }

        Medico oldMedico = medicoService.findMedicoById(id); // lança EntityNotFoundException se não existir

        if(!keycloakService.hasRoleSecretario(idSession) && !oldMedico.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse medico ou alterar os dados do mesmo.");
        }

        Medico medicoAtualizado = request.convertToEntity();

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
        if(!keycloakService.hasRoleSecretario(idSession) && !medico.getUserId().equals(idSession) && !keycloakService.hasRolePatologista(idSession)){
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse medico ou alterar os dados do mesmo.");
        }
        return medicoService.findMedicoById(id);
    }

    public List<Medico> findAllMedico() {
        return medicoService.findAllMedico();
    }

    @Transactional
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

    private Medico findMedicoByUserId(String idSession) {
        return medicoServiceInterface.findByUserId(idSession);
    }

    // Patologista--------------------------------------------------------------
    private final PatologistaServiceInterface patologistaService;

    @Transactional
    public Patologista savePatologista(PatologistaRequest request, String password) {
        Patologista patologista = request.convertToEntity();

        if (request.getEspecialidade() != null) {
            List<Especialidade> especialidades = new ArrayList<>(
                    request.getEspecialidade().stream()
                            .map(especialidadeRequest -> especialidadeServiceInterface.findEspecialidadeById(especialidadeRequest.getId()))
                            .toList()
            );
            patologista.setEspecialidade(especialidades);
        }

        Patologista savedPatologista = patologistaService.savePatologista(patologista);

        try {
            keycloakService.createUser(savedPatologista.getCpf(), savedPatologista.getEmail(), password, "patologista");
            String userKcId = keycloakService.getUserId(savedPatologista.getEmail());

            savedPatologista.setUserId(userKcId);
            return patologistaService.savePatologista(savedPatologista);

        } catch (Exception exception) {
            patologistaService.deletePatologista(savedPatologista.getId());
            throw new RuntimeException("Erro ao criar usuário no Keycloak: " + exception.getMessage(), exception);
        }
    }

    @Transactional
    public Patologista updatePatologista(Long id, PatologistaRequest request, String idSession) {
        if (request == null) {
            throw new IllegalArgumentException("Dados inválidos para atualização.");
        }

        Patologista oldPatologista = patologistaService.findPatologistaById(id); // lança EntityNotFoundException se não existir

        if(!keycloakService.hasRoleAdminLapa(idSession) && !oldPatologista.getUserId().equals(idSession)){
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse patologista ou alterar os dados do mesmo.");
        }

        Patologista patologistaAtualizado = request.convertToEntity();

        modelMapper.typeMap(Patologista.class, Patologista.class)
                .addMappings(mapper -> mapper.skip(Patologista::setId))
                .map(patologistaAtualizado, oldPatologista);

        Patologista newPatologista = patologistaService.updatePatologista(oldPatologista);
        keycloakService.updateUser(newPatologista.getUserId(), newPatologista.getEmail());
        return newPatologista;
    }

    public Patologista findPatologistaById(long id, String idSession) {
        Patologista patologista = patologistaService.findPatologistaById(id);

        if (!keycloakService.hasRoleAdminLapa(idSession) && !keycloakService.hasRolePatologista(idSession)) {
            throw new ForbiddenOperationException("Você não tem acesso para buscar esse patologista ou alterar os dados do mesmo.");
        }

        return patologista;
    }

    public List<Patologista> getAllPatologista() {
        return patologistaService.getAllPatologista();
    }

    @Transactional
    public void deletePatologista(long id) {
        patologistaService.deletePatologista(id);
    }

    // Raca--------------------------------------------------------------
    private final RacaServiceInterface racaServiceInterface;

    @Transactional
    public Raca saveRaca(RacaRequest newInstance) {
        Raca novaRaca = new Raca();

        novaRaca.setNome(newInstance.getNome());
        novaRaca.setDescricao(newInstance.getDescricao());
        novaRaca.setPorte(newInstance.getPorte());

        if (newInstance.getEspecie() != null) {
            Especie especie = especieServiceInterface.findEspecieById(newInstance.getEspecie().getId());
            novaRaca.setEspecie(especie);
        }

        return racaServiceInterface.saveRaca(novaRaca);
    }

    @Transactional
    public Raca updateRaca(RacaRequest obj, Long id) {
        //Raca o = obj.convertToEntity();
        Raca oldObject = findRacaById(id);

        if (obj.getEspecie() != null) {
            oldObject.setEspecie(findEspecieById(obj.getEspecie().getId()));
            obj.setEspecie(null);
        }

        TypeMap<RacaRequest, Raca> typeMapper = modelMapper
                .typeMap(RacaRequest.class, Raca.class)
                .addMappings(mapper -> mapper.skip(Raca::setId));


        typeMapper.map(obj, oldObject);
        return racaServiceInterface.updateRaca(oldObject);
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

    @Transactional
    public void deleteRaca(long id) {
        racaServiceInterface.deleteRaca(id);
    }

    // Aviso--------------------------------------------------------------
    private final AvisoServiceInterface avisoServiceInterface;

    @Transactional
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

    public List<Aviso> findAvisosHabilitados() {
        return avisoServiceInterface.findAvisosHabilitados();
    }

    @Transactional
    public void deleteAviso(long id) {
        avisoServiceInterface.deleteAviso(id);
    }

    // Vaga--------------------------------------------------------------

    private final VagaServiceInterface vagaServiceInterface;

    public List<Vaga> findAllVaga(String idSession) {
        if (keycloakService.hasRoleSecretario(idSession)) {
            return vagaServiceInterface.findAllVaga();
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = medicoServiceInterface.findByUserId(idSession);
            return vagaServiceInterface.findVagasByMedicoId(medico.getId());
        }

        return findVagasForTutor(idSession);
    }

    private List<Vaga> findVagasForTutor(String idSession) {
        Tutor tutor = tutorServiceInterface.findTutorByUserId(idSession);

        List<Long> animalIds = tutor.getAnimais().stream()
                .map(Animal::getId)
                .toList();

        return vagaServiceInterface.findVagasForTutor(animalIds);
    }

    @Transactional
    public Vaga saveVaga(Vaga newInstance) {
        newInstance.setStatus(String.valueOf(StatusAgendamentoEVaga.Disponivel));
        return vagaServiceInterface.saveVaga(newInstance);
    }

    @Transactional
    protected Vaga updateVaga(Vaga transientObject) {
        return vagaServiceInterface.updateVaga(transientObject);
    }

    @Transactional
    public Vaga processUpdateVaga(VagaRequest obj, Long id){
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

    public Vaga findVagaById(long id, String idSession) {
        Vaga vaga = vagaServiceInterface.findVagaById(id);

        if (keycloakService.hasRoleSecretario(idSession)) {
            return vaga;
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = medicoServiceInterface.findByUserId(idSession);
            if (vaga.getMedico().equals(medico)) {
                return vaga;
            }
            throw new ForbiddenOperationException("Você não tem acesso a esta vaga.");
        }

        Tutor tutor = tutorServiceInterface.findTutorByUserId(idSession);
        if (vaga.getAgendamento() == null || tutor.getAnimais().contains(vaga.getAgendamento().getAnimal())) {
            return vaga;
        }

        throw new ForbiddenOperationException("Você não tem acesso a esta vaga.");
    }

    public List<Vaga> findVagasByData(LocalDate data, String idSession) {
        List<Vaga> vagas = vagaServiceInterface.findVagasByData(data);

        if (keycloakService.hasRoleSecretario(idSession)) {
            return vagas;
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = medicoServiceInterface.findByUserId(idSession);
            return vagas.stream()
                    .filter(v -> v.getMedico().equals(medico))
                    .toList();
        }

        Tutor tutor = tutorServiceInterface.findTutorByUserId(idSession);
        return vagas.stream()
                .filter(v -> v.getAgendamento() == null ||
                        tutor.getAnimais().contains(v.getAgendamento().getAnimal()))
                .toList();
    }

    public List<Vaga> findVagaBetweenInicialAndFinalDate(LocalDate dataInicial, LocalDate dataFinal, String idSession) {
        List<Vaga> vagas = vagaServiceInterface.findVagaBetweenInicialAndFinalDate(dataInicial, dataFinal);

        if (keycloakService.hasRoleSecretario(idSession)) {
            return vagas;
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = medicoServiceInterface.findByUserId(idSession);
            return vagas.stream()
                    .filter(v -> v.getMedico().equals(medico))
                    .toList();
        }

        Tutor tutor = tutorServiceInterface.findTutorByUserId(idSession);
        return vagas.stream()
                .filter(v -> v.getAgendamento() == null || tutor.getAnimais().contains(v.getAgendamento().getAnimal()))
                .toList();
    }

    public List<Vaga> findVagasAndAgendamentoByMedico (LocalDate data, Long IdMedico, String idSession) {
        Medico medico = findMedicoById(IdMedico, idSession);

        return vagaServiceInterface.findVagasAndAgendamentoByMedico(data, medico);
    }

    public List<Animal> findAnimaisWithReturn() {
        List<Vaga> vagas = vagaServiceInterface.findLatestVagaForEachAnimal();

        return vagas.stream()
                .map(vaga -> vaga.getAgendamento().getAnimal())
                .collect(Collectors.toList());
    }

    public List<Animal> findAnimaisWithoutReturn(){
        List<Vaga> vagas = vagaServiceInterface.findLatestVagaForEachAnimalNotReturn();

        List<Animal> allAnimais = animalServiceInterface.findAnimalsByOrigemAnimal(OrigemAnimal.HVU);
        List<Agendamento> allAgendamento = getAllAgendamento();
        List<Animal> animalNoReturn = allAnimais.stream()
                .filter(animal -> allAgendamento.stream()
                        .noneMatch(agendamento -> agendamento.getAnimal().equals(animal)))
                .collect(Collectors.toList());

        animalNoReturn
                .addAll(vagas.stream()
                        .map(vaga -> vaga.getAgendamento().getAnimal())
                        .toList());
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

    public String verificaSeAnimalPodeMarcarPrimeiraConsultaRetornoOuConsulta(Long id, String idSession) {
        Animal animal = animalServiceInterface.findAnimalById(id);

        Tutor tutor = tutorServiceInterface.findTutorByAnimalId(animal.getId());
        if (!tutor.getUserId().equals(idSession) && !keycloakService.hasRoleSecretario(idSession)) {
            throw new ForbiddenOperationException("Este não é o seu animal");
        }

        // verifica se animal já tem uma consulta em aberto
        List<Agendamento> allAgendamentos = getAllAgendamento();
        boolean consultaEmAberto = allAgendamentos.stream()
                .anyMatch(agendamento -> agendamento.getAnimal() != null &&
                        agendamento.getAnimal().getId() == animal.getId() &&
                        !agendamento.getStatus().equals("Finalizado") && !agendamento.getStatus().equals("Cancelado"));

        if (consultaEmAberto) {
            return "Bloqueado";
        } else if (isAnimalWithRetorno(animal.getId()) || !isRetornoExpirado(animal.getId())) {
            return "Retorno";
        } else {
            return "Primeira Consulta";
        }
    }

    public boolean isAnimalWithRetorno(Long id) {
        Animal animal = animalServiceInterface.findAnimalById(id);
        return findAnimaisWithReturn().contains(animal);
    }

    public List<Vaga> findVagaByDataAndTurno(LocalDate data, String turno) {
        return vagaServiceInterface.findVagasByDataAndTurno(data, turno);
    }

    @Transactional
    public void deleteVaga(long id) {
        vagaServiceInterface.deleteVaga(id);
    }

    public List<Vaga> getVagasByEspecialidade(long idEspecialidade) {
        Especialidade especialidade = especialidadeServiceInterface.findEspecialidadeById(idEspecialidade);
        return vagaServiceInterface.findVagaByEspecialidade(especialidade);
    }

    public Vaga getVagaByAgendamento(long idAgendamento, String idSession) {
        Agendamento agendamento = findAgendamentoById(idAgendamento, idSession);
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
            if (isWeekend(startDate)) {
                detalheBuilder.append(createVagas(startDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao, idSessio));
                detalheBuilder.append(" ").append(createVagas(startDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao, idSessio));
            }
        } else {
            LocalDate currentDate = startDate;
            while (!currentDate.isAfter(endDate)) {
                if (isWeekend(currentDate)) {
                    detalheBuilder.append(createVagas(currentDate, vagaRequestDTO.getTurnoManha(), "Manhã", vagas, countCriacao, idSessio));
                    detalheBuilder.append(" ").append(createVagas(currentDate, vagaRequestDTO.getTurnoTarde(), "Tarde", vagas, countCriacao, idSessio));
                }
                currentDate = currentDate.plusDays(1);
            }
        }

        return detalheBuilder.toString().trim();
    }

    private boolean isWeekend(LocalDate date) {
        return date.getDayOfWeek() != DayOfWeek.SATURDAY && date.getDayOfWeek() != DayOfWeek.SUNDAY;
    }

    @Transactional
    protected String createVagas(LocalDate data, List<VagaTipoRequest> vagaTipo, String turno, List<Vaga> vagas, long[] countCriacao, String idSession) {
        List<Vaga> vagasByData = findVagasByData(data, idSession);
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

    private boolean existsVagaByMedicoIdAndAnimalId(Long medicoId, Long animalId) {
        Medico medico = medicoServiceInterface.findMedicoById(medicoId);

        return vagaServiceInterface.findVagasByMedicoId(medicoId).stream()
                .filter(vaga -> vaga.getAgendamento() != null)
                .filter(vaga -> vaga.getAgendamento().getAnimal() != null)
                .anyMatch(vaga -> vaga.getMedico().equals(medico) &&
                        vaga.getAgendamento().getAnimal().getId() == animalId);
    }

    // Consulta--------------------------------------------------------------

    private final ConsultaServiceInterface consultaServiceInterface;

    @Transactional
    public Consulta saveConsulta(Long id, Consulta newInstance) {
        Vaga vagaDaConsulta = vagaServiceInterface.findVagaById(id);
        Agendamento agendamentoVaga = agendamentoServiceInterface.findAgendamentoById(vagaDaConsulta.getAgendamento().getId());

        if (agendamentoVaga.getStatus().equals("Finalizado")) {
            throw new ForbiddenOperationException("Esse agendamento já foi finalizado.");
        }

        Consulta consulta = consultaServiceInterface.saveConsulta(newInstance);

        vagaDaConsulta.setStatus("Finalizado");
        agendamentoVaga.setStatus("Finalizado");

        vagaDaConsulta.setAgendamento(agendamentoVaga);
        vagaDaConsulta.setConsulta(consulta);

        updateVaga(vagaDaConsulta);
        updateAgendamento(agendamentoVaga);

        return consulta;
    }

    @Transactional
    public Consulta updateConsulta(ConsultaRequest obj, Long id, String idSession) {
        //Consulta o = obj.convertToEntity();
        Consulta oldObject = findConsultaById(id);

        // medico
        if(obj.getMedico() != null){
            oldObject.setMedico(findMedicoById(obj.getMedico().getId(), idSession));
            obj.setMedico(null);
        }

        // animal
        if (obj.getAnimal() != null) {
            oldObject.setAnimal(findAnimalById(obj.getAnimal().getId(), idSession));
            obj.setAnimal(null);
        }

        TypeMap<ConsultaRequest, Consulta> typeMapper = modelMapper
                .typeMap(ConsultaRequest.class, Consulta.class)
                .addMappings(mapper -> mapper.skip(Consulta::setId));


        typeMapper.map(obj, oldObject);
        return consultaServiceInterface.updateConsulta(oldObject);
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

    @Transactional
    public void deleteConsulta(long id) {
        consultaServiceInterface.deleteConsulta(id);
    }


    // Especialidade--------------------------------------------------------------

    private final EspecialidadeServiceInterface especialidadeServiceInterface;

    @Transactional
    public Especialidade saveEspecialidade(Especialidade newInstance) {
        return especialidadeServiceInterface.saveEspecialidade(newInstance);
    }

    @Transactional
    public Especialidade updateEspecialidade(EspecialidadeRequest obj, Long id) {
        //Especialidade o = obj.convertToEntity();
        Especialidade oldObject = findEspecialidadeById(id);

        TypeMap<EspecialidadeRequest, Especialidade> typeMapper = modelMapper
                .typeMap(EspecialidadeRequest.class, Especialidade.class)
                .addMappings(mapper -> mapper.skip(Especialidade::setId));


        typeMapper.map(obj, oldObject);
        return especialidadeServiceInterface.updateEspecialidade(oldObject);
    }

    public Especialidade findEspecialidadeById(long id) {
        return especialidadeServiceInterface.findEspecialidadeById(id);
    }

    public List<Especialidade> getAllEspecialidade() {
        return especialidadeServiceInterface.getAllEspecialidade();
    }

    @Transactional
    public void deleteEspecialidade(long id) {
        especialidadeServiceInterface.deleteEspecialidade(id);
    }

    // Agendamento--------------------------------------------------------------
    private final AgendamentoServiceInterface agendamentoServiceInterface;

    @Transactional
    public Agendamento saveAgendamento(AgendamentoRequest newInstance, Long idVaga, String idSession) {
        Animal animal = findAnimalById(newInstance.getAnimal().getId(), idSession);
        Vaga vaga = vagaServiceInterface.findVagaByIdWithLock(idVaga);

        if (animal.getOrigemAnimal() != OrigemAnimal.HVU) {
            throw new IllegalArgumentException("Só é permitido agendar animais com origem HVU.");
        }

        if (animal.isObito()) {
            throw new IllegalArgumentException("Não é permitido agendar animais que tiveram óbito.");
        }

        if (vaga.getDataHora().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("A vaga não pode estar no passado.");
        }

        Agendamento agendamento = newInstance.convertToEntity();
        agendamento.setAnimal(animal);
        return confirmarAgendamento(vaga, agendamento);
    }

    @Transactional
    public Agendamento createAgendamentoEspecial(AgendamentoEspecialRequest newObject, String idSession) {
        Animal animal = animalServiceInterface.findAnimalById(newObject.getAnimal().getId());
        if (animal.getOrigemAnimal() != OrigemAnimal.HVU) {
            throw new IllegalArgumentException("Só é permitido agendar animais com origem HVU.");
        }

        if (animal.isObito()) {
            throw new IllegalArgumentException("Não é permitido agendar animais que tiveram óbito.");
        }

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


    @Transactional // Minimiza inconsistências ao criar agendamento
    private Agendamento confirmarAgendamento(Vaga vaga, Agendamento agendamento) {
        if (vagaServiceInterface.existsByIdAndAgendamentoIsNotNull(vaga.getId())) {
            throw new BusinessException("vaga.ocupada", "A vaga já foi ocupada por outro agendamento.");
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

        Agendamento oldObject = findAgendamentoById(id, userId);

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
    @Transactional
    public Agendamento reagendarAgendamento(Long idAgendamento, Long idVaga, String idSession){
        if (!keycloakService.hasRoleSecretario(idSession) || !keycloakService.hasRoleTutor(idSession)) {
            throw new ForbiddenOperationException("Você não é responsável por este agendamento.");
        }

        Agendamento agendamento = findAgendamentoById(idAgendamento, idSession);
        Vaga vagaAntiga = getVagaByAgendamento(agendamento.getId(), idSession);
        Vaga novaVaga = findVagaById(idVaga, idSession);

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

    public Agendamento findAgendamentoById(long id, String idSession) {
        Agendamento agendamento = agendamentoServiceInterface.findAgendamentoById(id);

        if (keycloakService.hasRoleSecretario(idSession)) {
            return agendamento;
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Vaga vaga = vagaServiceInterface.findVagaByAgendamento(agendamento);
            Medico medico = vaga.getMedico();

            if(!medico.getUserId().equals(idSession)) {
                throw new ForbiddenOperationException("Você não é o médico responsável por este agendamento.");
            }
            return agendamento;
        }

        Tutor tutor = tutorServiceInterface.findTutorByAnimalId(agendamento.getAnimal().getId());
        if(!tutor.getUserId().equals(idSession)) {
            throw new ForbiddenOperationException("Você não é o tutor responsável por este agendamento.");
        }

        return agendamento;
    }


    public List<Agendamento> getAllAgendamento() {
        return agendamentoServiceInterface.getAllAgendamento();
    }

    public List<Agendamento> findAgendamentosByMedicoId(Long medicoId, String idSession){
        if (!keycloakService.hasRoleMedico(idSession) && !keycloakService.hasRoleSecretario(idSession)) {
            throw new AccessDeniedException("Acesso Negado");
        }

        Medico medico = findMedicoById(medicoId, idSession);

        if (keycloakService.hasRoleMedico(idSession) && !medico.getUserId().equals(idSession)) {
                throw new ForbiddenOperationException("Você não é o médico responsável por estes agendamentos.");
            }

        return agendamentoServiceInterface.findAgendamentosByMedicoId(medico);
    }

    public List<Agendamento> findAgendamentosByTutorUserId(String idSession) {
        Tutor tutor = findTutorByUserId(idSession);

        List<Animal> animais = tutor.getAnimais();

        List<Agendamento> agendamentos = new ArrayList<>();
        for (Animal animal : animais) {
            List<Agendamento> agendamentosForAnimal = agendamentoServiceInterface.findAgendamentosByAnimal(animal);
            agendamentos.addAll(agendamentosForAnimal);
        }

        return agendamentos;
    }

    public List<LocalDateTime> retornaVagaQueTutorNaoPodeAgendar(String id){
        Tutor tutor = tutorServiceInterface.findTutorById(Long.parseLong(id));

        List<Agendamento> agendamentosTutor = new ArrayList<>();
        for (Animal animal : tutor.getAnimais()) {
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

    @Transactional
    public void deleteAgendamento(long id) {
        agendamentoServiceInterface.deleteAgendamento(id);
    }

    // Endereco--------------------------------------------------------------

    private final EnderecoServiceInterface enderecoServiceInterface;

    @Transactional
    public Endereco saveEndereco(Endereco newInstance) {
        return enderecoServiceInterface.saveEndereco(newInstance);
    }

    @Transactional
    public Endereco updateEndereco(EnderecoRequest obj, Long id) {
        //Endereco o = obj.convertToEntity();
        Endereco oldObject = findEnderecoById(id);

        TypeMap<EnderecoRequest, Endereco> typeMapper = modelMapper
                .typeMap(EnderecoRequest.class, Endereco.class)
                .addMappings(mapper -> mapper.skip(Endereco::setId));


        typeMapper.map(obj, oldObject);
        return enderecoServiceInterface.updateEndereco(oldObject);
    }

    public Endereco findEnderecoById(long id) {
        return enderecoServiceInterface.findEnderecoById(id);
    }

    public List<Endereco> getAllEndereco() {
        return enderecoServiceInterface.getAllEndereco();
    }

    @Transactional
    public void deleteEndereco(long id) {
        enderecoServiceInterface.deleteEndereco(id);
    }

    // Estagiario--------------------------------------------------------------

    private final EstagiarioServiceInterface estagiarioServiceInterface;

    @Transactional
    public Estagiario saveEstagiario(Estagiario newInstance) {
        return estagiarioServiceInterface.saveEstagiario(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteEstagiario(long id) {
        estagiarioServiceInterface.deleteEstagiario(id);
    }

    // Animal--------------------------------------------------------------
    private final AnimalServiceInterface animalServiceInterface;

    private void validarOrigemAnimal(String role, OrigemAnimal origemAnimal) {
        if ("TUTOR".equals(role) && origemAnimal != OrigemAnimal.HVU) {
            throw new OrigemAnimalInvalidaException("Tutores só podem cadastrar animais com origem 'HVU'");
        }
        if ("PATOLOGISTA".equals(role) && origemAnimal != OrigemAnimal.LAPA) {
            throw new OrigemAnimalInvalidaException("Patologistas só podem cadastrar animais com origem 'LAPA'");
        }
    }

    @Transactional
    public Animal saveAnimal(Animal newInstance, String idSession) {
        newInstance.setRaca(racaServiceInterface.findRacaById(newInstance.getRaca().getId()));

        Tutor tutor = findTutorByUserId(idSession);
        if (tutor == null) {
            throw new ResourceNotFoundException("Tutor", "o idSession ", idSession);
        }

        if (newInstance.getOrigemAnimal() == null) {
            newInstance.setOrigemAnimal(OrigemAnimal.HVU);
        }

        validarOrigemAnimal("TUTOR", newInstance.getOrigemAnimal());

        Animal animal = animalServiceInterface.saveAnimal(newInstance);
        tutor.getAnimais().add(animal);
        tutorServiceInterface.updateTutor(tutor);
        return animal;
    }

    private Tutor determinarTutor(AnimalByPatologistaRequest request) {
        int count = 0;
        if (request.getTutor() != null) count++;
        if (request.getTutorId() != null) count++;
        if (request.isAnonimo()) count++;

        if (count != 1) {
            throw new IllegalArgumentException("Você deve enviar uma das opções: tutor, tutorId ou anonimo");
        }

        if (request.isAnonimo()) return tutorServiceInterface.getOrCreateAnonymousTutor();

        if (request.getTutorId() != null) return tutorServiceInterface.findTutorById(request.getTutorId());

        tutorServiceInterface.verificarDuplicidade(
                request.getTutor().getCpf(),
                request.getTutor().getEmail()
        );
        return tutorServiceInterface.saveTutor(request.getTutor().convertToEntity());
    }

    @Transactional
    public Animal saveAnimalByPatologista(AnimalByPatologistaRequest request) {
        Animal animal = request.getAnimal().convertToEntity();

        if (animal.getOrigemAnimal() == null) {
            animal.setOrigemAnimal(OrigemAnimal.LAPA);
        }
        validarOrigemAnimal("PATOLOGISTA", animal.getOrigemAnimal());

        Tutor tutor = determinarTutor(request);

        if (tutor.getAnimais() == null) {
            tutor.setAnimais(new ArrayList<>());
        }
        tutor.getAnimais().add(animal);
        Animal savedAnimal = animalServiceInterface.saveAnimal(animal);

        tutorServiceInterface.updateTutor(tutor);

        return savedAnimal;
    }

    @Transactional
    public Animal updateAnimal(Long id, AnimalRequest request, String idSession) {
        Animal animal = animalServiceInterface.findAnimalById(id);
        Tutor tutor = tutorServiceInterface.findTutorByAnimalId(animal.getId());
        Medico medico = findMedicoByUserId(idSession);

        boolean isPatologista = keycloakService.hasRolePatologista(idSession);
        boolean isMedico = keycloakService.hasRoleMedico(idSession);
        boolean isTutor = keycloakService.hasRoleTutor(idSession);

        if (isTutor && !tutor.getUserId().equals(idSession)) {
            throw new ForbiddenOperationException("Você não é responsável por este animal");
        }

        if (isMedico && !existsVagaByMedicoIdAndAnimalId(medico.getId(), animal.getId())) {
            throw new ForbiddenOperationException("Você não é o médico responsável por este animal");
        }

        if (!isPatologista && !animal.getOrigemAnimal().equals(OrigemAnimal.HVU)) {
            throw new ForbiddenOperationException("Você só pode editar animais de origem HVU");
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

    public Animal findAnimalById(long animalId, String idSession) {
        // caso não seja um secretario ou medico, verifica se o animal pertece ao tutor de fato
        if (!keycloakService.hasRoleSecretario(idSession) && !keycloakService.hasRoleMedico(idSession) && !keycloakService.hasRolePatologista(idSession)) {
            Tutor tutor = tutorServiceInterface.findTutorByAnimalId(animalId);

            if (!tutor.getUserId().equals(idSession)) {
                throw new ForbiddenOperationException("Este não é o seu animal");
            }
        }

        if (keycloakService.hasRoleMedico(idSession)) {
            Medico medico = findMedicoByUserId(idSession);

            if (!existsVagaByMedicoIdAndAnimalId(medico.getId(), animalId)) {
                throw new ForbiddenOperationException("Você não é o médico responsável por este animal");
            }
        }

        return animalServiceInterface.findAnimalById(animalId);
    }

    public List<Animal> getAllAnimal() {
        return animalServiceInterface.getAllAnimal();
    }

    public List<Animal> getAllAnimalTutor(String userId) {
        Tutor tutor = findTutorByUserId(userId);
        return tutor.getAnimais();
    }

    public Animal getAnimalByFichaNumber(String fichaNumero) {
        Animal animal = animalServiceInterface.findAnimalByFichaNumber(fichaNumero);

        if (!animal.getOrigemAnimal().equals(OrigemAnimal.HVU)) {
            throw new ForbiddenOperationException("Você não tem acesso a animais dessa origem");
        }

        return animal;
    }

    @Transactional
    public void deleteAnimal(long id, String userId) {
        Tutor tutor = tutorServiceInterface.findTutorByAnimalId(id);
        Animal animal = animalServiceInterface.findAnimalById(id);

        boolean isPatologista = keycloakService.hasRolePatologista(userId);
        if (isPatologista && !animal.getOrigemAnimal().equals(OrigemAnimal.LAPA)) {
            throw new ForbiddenOperationException("Você não tem permissão para deletar este animal");
        }

        boolean isTutor = keycloakService.hasRoleTutor(userId);
        if(isTutor && !tutor.getUserId().equals(userId)) {
            throw new ForbiddenOperationException("Você não tem permissão para deletar este animal");
        }

        animalServiceInterface.deleteAnimal(id);
    }

    public List<Animal> findAnimalsByOrigemAnimal(OrigemAnimal origem, String userId) {
        if (keycloakService.hasRolePatologista(userId)) {
            return animalServiceInterface.findAnimalsByOrigemAnimal(origem);
        }

        if ((keycloakService.hasRoleSecretario(userId) && origem == OrigemAnimal.HVU)) {
            return animalServiceInterface.findAnimalsByOrigemAnimal(origem);
        }

        throw new ForbiddenOperationException("Você não tem acesso a animais dessa origem");
    }

    // Especie--------------------------------------------------------------

    private final EspecieServiceInterface especieServiceInterface;

    @Transactional
    public Especie saveEspecie(Especie newInstance) {
        return especieServiceInterface.saveEspecie(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteEspecie(long id) {
        especieServiceInterface.deleteEspecie(id);
    }

    // Area--------------------------------------------------------------
    private final AreaServiceInterface areaServiceInterface;

    @Transactional
    public Area saveArea(Area newInstance) {
        if (newInstance.getEspecie() != null) {
            Especie especie = especieServiceInterface.findEspecieById(newInstance.getEspecie().getId());
            newInstance.setEspecie(especie);
        }

        return areaServiceInterface.saveArea(newInstance);
    }

    @Transactional
    public Area updateArea(AreaRequest transientObject, Long id) {
        Area oldObject = findAreaById(id);

        if (transientObject.getTituloArea() != null) {
            oldObject.setTituloArea(transientObject.getTituloArea());
        }

        if (transientObject.getEspecie() != null) {
            Especie especie = especieServiceInterface.findEspecieById(transientObject.getEspecie().getId());
            oldObject.setEspecie(especie);
        }

        return areaServiceInterface.updateArea(oldObject);
    }

    public Area findAreaById(Long id) {
        return areaServiceInterface.findAreaById(id);
    }

    public List<Area> getAllArea() {
        return areaServiceInterface.getAllArea();
    }

    @Transactional
    public void deleteArea(long id) {
        areaServiceInterface.deleteArea(id);
    }

    // CampoLaudo--------------------------------------------------------------
    private final CampoLaudoServiceInterface campoLaudoServiceInterface;

    @Transactional
    public CampoLaudo saveCampoLaudo(CampoLaudo newInstance) {
        return campoLaudoServiceInterface.saveCampoLaudo(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteCampoLaudo(long id) {
        campoLaudoServiceInterface.deleteCampoLaudo(id);
    }

    // Etapa--------------------------------------------------------------

    private final EtapaServiceInterface etapaServiceInterface;

    @Transactional
    public Etapa saveEtapa(Etapa newInstance) {
        return etapaServiceInterface.saveEtapa(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteEtapa(long id) {
        etapaServiceInterface.deleteEtapa(id);
    }

    // Ficha--------------------------------------------------------------


    private final FichaServiceInterface fichaServiceInterface;

    @Transactional
    public Ficha saveFicha(Ficha newInstance) {
        Long agendamentoId = (newInstance.getAgendamento() != null)
                ? newInstance.getAgendamento().getId()
                : null;

        if (agendamentoId == null || agendamentoId <= 0) {
            throw new IllegalArgumentException("Ficha deve estar vinculada a um agendamento válido.");
        }

        if (!agendamentoRepository.existsById(agendamentoId)) {
            throw new ResourceNotFoundException("Agendamento", "id", agendamentoId);
        }

        return fichaServiceInterface.saveFicha(newInstance);
    }

    @Transactional
    public Ficha updateFicha(FichaRequest obj, Long id) {
        if (obj == null) {
            throw new IllegalArgumentException("FichaRequest não pode ser nulo.");
        }

        if (obj.getAgendamento() == null) {
            throw new IllegalArgumentException("Ficha deve estar vinculada a um agendamento.");
        }

        Long agendamentoId = obj.getAgendamento().getId();
        if (!agendamentoRepository.existsById(agendamentoId)) {
            throw new ResourceNotFoundException("Agendamento", "id", agendamentoId);
        }

        Ficha existingFicha = findFichaById(id);
        obj.applyToEntity(existingFicha);
        return fichaServiceInterface.updateFicha(existingFicha);
    }

    public Ficha findFichaById(long id) {
        return fichaServiceInterface.findFichaById(id);
    }

    public List<Ficha> findFichasByAgendamentoId(Long agendamentoId) {
        if (agendamentoId == null || agendamentoId <= 0) {
            throw new IllegalArgumentException("O id do agendamento é inválido.");
        }
        if (!agendamentoRepository.existsById(agendamentoId)) {
            throw new ResourceNotFoundException("Agendamento", "id", agendamentoId);
        }

        return fichaServiceInterface.findFichasByAgendamentoId(agendamentoId);
    }

    public List<Ficha> findFichasByAnimalId(Long animalId) {
        if (animalId == null || animalId <= 0) {
            throw new IllegalArgumentException("O id do animal é inválido.");
        }
        if (!animalRepository.existsById(animalId)) {
            throw new ResourceNotFoundException("Animal", "id", animalId);
        }

        return fichaServiceInterface.findFichasByAnimalId(animalId);
    }

    public List<Ficha> getAllFicha() {
        return fichaServiceInterface.getAllFicha();
    }

    @Transactional
    public void deleteFicha(long id) {
        fichaServiceInterface.deleteFicha(id);
    }

    // FichaSolicitacaoServico--------------------------------------------------------------

    private final FichaSolicitacaoServicoServiceInterface fichaSolicitacaoServicoServiceInterface;
    private final CodigoPatologiaService codigoPatologiaService;

    @Transactional
    public FichaSolicitacaoServico saveFichaSolicitacaoServico(FichaSolicitacaoServico newInstance) {
        TipoServico tipo = newInstance.getTipoServico();
        String codigo = codigoPatologiaService.gerarCodigo(tipo);
        newInstance.setCodigoPatologia(codigo);

        if (newInstance.getAnimal() != null) {
            Animal animal = animalServiceInterface.findAnimalById(newInstance.getAnimal().getId());
            newInstance.setAnimal(animal);
        }

        if (newInstance.getTutor() != null) {
            Tutor tutor = tutorServiceInterface.findTutorById(newInstance.getTutor().getId());
            newInstance.setTutor(tutor);
        }

        if (newInstance.getMedico() != null) {
            Medico medico = medicoServiceInterface.findMedicoById(newInstance.getMedico().getId());
            newInstance.setMedico(medico);
        }

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

    @Transactional
    public void deleteFichaSolicitacaoServico(long id) {
        fichaSolicitacaoServicoServiceInterface.deleteFichaSolicitacaoServico(id);
    }

    // Foto--------------------------------------------------------------

    private final FotoServiceInterface fotoServiceInterface;

    @Transactional
    public Foto saveFoto(MultipartFile file, String title) {
        return fotoServiceInterface.save(file, title);
    }

    @Transactional
    public Foto replaceFoto(long id, MultipartFile newFile, String newTitle) {
        return fotoServiceInterface.replaceFile(id, newFile, newTitle);
    }

    public Foto findFotoById(long id) {
        return fotoServiceInterface.findById(id);
    }

    public byte[] loadFotoFile(long id) {
        return fotoServiceInterface.loadFile(id);
    }

    public List<Foto> findllFotos() {
        return fotoServiceInterface.findAll();
    }

    @Transactional
    public void deleteFoto(long id) {
        fotoServiceInterface.delete(id);
    }

    // Instituicao--------------------------------------------------------------

    private final InstituicaoServiceInterface instituicaoServiceInterface;

    @Transactional
    public Instituicao saveInstituicao(Instituicao newInstance) {
        return instituicaoServiceInterface.saveInstituicao(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteInstituicao(long id) {
        instituicaoServiceInterface.deleteInstituicao(id);
    }


    // LaudoNecropsia--------------------------------------------------------------

    private final LaudoNecropsiaServiceInterface laudoNecropsiaServiceInterfcae;

    @Transactional
    public LaudoNecropsia saveLaudoNecropsia(LaudoNecropsia newInstance) {
        if (newInstance.getFichaSolicitacaoServico() != null) {
            FichaSolicitacaoServico ficha = fichaSolicitacaoServicoServiceInterface.findFichaSolicitacaoServicoById(
                            newInstance.getFichaSolicitacaoServico().getId());
            newInstance.setFichaSolicitacaoServico(ficha);
        }

        return laudoNecropsiaServiceInterfcae.saveLaudoNecropsia(newInstance);
    }

    @Transactional
    public LaudoNecropsia updateLaudoNecropsia(LaudoNecropsiaRequest transientObject, Long id) {
        LaudoNecropsia oldObject = laudoNecropsiaServiceInterfcae.findLaudoNecropsiaById(id);

        oldObject.setConclusao(transientObject.getConclusao());
        oldObject.setDescricaoMacroscopia(transientObject.getDescricaoMacroscopia());
        oldObject.setDescricaoMicroscopia(transientObject.getDescricaoMicroscopia());

        if (transientObject.getFichaSolicitacaoServico() != null) {
            FichaSolicitacaoServico ficha = fichaSolicitacaoServicoServiceInterface
                    .findFichaSolicitacaoServicoById(transientObject.getFichaSolicitacaoServico().getId());
            oldObject.setFichaSolicitacaoServico(ficha);
        }

        if (transientObject.getCampoLaudo() != null) {
            List<CampoLaudo> novosCampos = new ArrayList<>();
            for (CampoLaudoRequest campoReq : transientObject.getCampoLaudo()) {
                CampoLaudo campo = findCampoLaudoById(campoReq.getId());
                novosCampos.add(campo);
            }
            oldObject.setCampoLaudo(novosCampos);
        }

        if (transientObject.getCampoMicroscopia() != null) {
            List<CampoLaudoMicroscopia> novosCamposMicroscopia = new ArrayList<>();
            for (CampoLaudoMicroscopiaRequest campoReq : transientObject.getCampoMicroscopia()) {
                CampoLaudoMicroscopia campo = findCampoLaudoMicroscopiaById(campoReq.getId());
                novosCamposMicroscopia.add(campo);
            }
            oldObject.setCampoMicroscopia(novosCamposMicroscopia);
        }

        if (transientObject.getEstagiario() != null) {
            List<Estagiario> novosEstagiarios = new ArrayList<>();
            for (EstagiarioRequest estagiarioReq : transientObject.getEstagiario()) {
                Estagiario estagiario = estagiarioServiceInterface.findEstagiarioById(estagiarioReq.getId());
                novosEstagiarios.add(estagiario);
            }
            oldObject.setEstagiario(novosEstagiarios);
        }

        if (transientObject.getFoto() != null) {
            List<Foto> novasFotos = new ArrayList<>();
            for (FotoRequest fotoReq : transientObject.getFoto()) {
                Foto foto = fotoServiceInterface.findById(fotoReq.getId());
                novasFotos.add(foto);
            }
            oldObject.setFoto(novasFotos);
        }

        return laudoNecropsiaServiceInterfcae.updateLaudoNecropsia(oldObject);
    }

    public LaudoNecropsia findLaudoNecropsiaById(long id) {
        return laudoNecropsiaServiceInterfcae.findLaudoNecropsiaById(id);
    }

    public List<LaudoNecropsia> getAllLaudoNecropsia() {
        return laudoNecropsiaServiceInterfcae.getAllLaudoNecropsia();
    }

    @Transactional
    public void deleteLaudoNecropsia(long id) {
        laudoNecropsiaServiceInterfcae.deleteLaudoNecropsia(id);
    }

    // MaterialColetado--------------------------------------------------------------

    private final MaterialColetadoServiceInterface materialColetadoServiceInterface;

    @Transactional
    public MaterialColetado saveMaterialColetado(MaterialColetado newInstance) {
        return materialColetadoServiceInterface.saveMaterialColetado(newInstance);
    }

    @Transactional
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

    @Transactional
    public void deleteMaterialColetado(long id) {
        materialColetadoServiceInterface.deleteMaterialColetado(id);
    }

    // Orgao--------------------------------------------------------------

    private final OrgaoServiceInterface orgaoServiceInterface;

    @Transactional
    public Orgao saveOrgao(Orgao newInstance) {
        return orgaoServiceInterface.saveOrgao(newInstance);
    }

    @Transactional
    public Orgao updateOrgao(OrgaoRequest transientObject, Long id) {
        Orgao oldObject = orgaoServiceInterface.findOrgaoById(id);

        if (transientObject.getNome() != null) oldObject.setNome(transientObject.getNome());
        if (transientObject.getSexoMacho() != null) oldObject.setSexoMacho(transientObject.getSexoMacho());
        if (transientObject.getSexoFemea() != null) oldObject.setSexoFemea(transientObject.getSexoFemea());

        if (transientObject.getFoto() != null) {
            Foto novaFoto = fotoServiceInterface.findById(transientObject.getFoto().getId());
            oldObject.setFoto(novaFoto);
        }

        if (transientObject.getArea() != null) {
            List<Area> novasAreas = new ArrayList<>();
            for (AreaRequest areaAtual : transientObject.getArea()) {
                Area area = areaServiceInterface.findAreaById(areaAtual.getId());
                novasAreas.add(area);
            }
            oldObject.setArea(novasAreas);
        }

        return orgaoServiceInterface.updateOrgao(oldObject);
    }

    public Orgao findOrgaoById(long id) {
        return orgaoServiceInterface.findOrgaoById(id);
    }

    public List<Orgao> getAllOrgao() {
        return orgaoServiceInterface.getAllOrgao();
    }

    @Transactional
    public void deleteOrgao(long id) {
        orgaoServiceInterface.deleteOrgao(id);
    }


    // Arquivo --------------------------------------------------------------


    private final FileServiceInterface fileService;

    public File findFile(String fileName) {
        return fileService.findFile(fileName);
    }

    @Transactional
    public String storeFile(InputStream file, String fileName) {
        String fn = System.currentTimeMillis() + "-" + fileName;
        return fileService.storeFile(file, fn.replace(" ", ""));
    }

    @Transactional
    public void deleteFile(String fileName) {
        fileService.deleteFile(fileName);
    }

    // CampoLaudoMicroscopia --------------------------------------------------------------

    private final CampoLaudoMicroscopiaServiceInterface campoLaudoMicroscopiaServiceInterface;
    private final AnimalRepository animalRepository;
    private final AgendamentoRepository agendamentoRepository;
    private final OrgaoRepository orgaoRepository;

    @Transactional
    public CampoLaudoMicroscopia saveCampoLaudoMicroscopia(CampoLaudoMicroscopia newInstance) {
        return campoLaudoMicroscopiaServiceInterface.saveCampoLaudoMicroscopia(newInstance);
    }

    @Transactional
    public CampoLaudoMicroscopia updateCampoLaudoMicroscopia(CampoLaudoMicroscopiaRequest obj, Long id) {
        CampoLaudoMicroscopia oldObject = findCampoLaudoMicroscopiaById(id);

        if (obj.getOrgao() != null && obj.getOrgao().getId() > 0) {
            Orgao orgaoReal = orgaoServiceInterface.findOrgaoById(obj.getOrgao().getId());
            oldObject.setOrgao(orgaoReal);
        } else {
            oldObject.setOrgao(null);
        }

        oldObject.setDescricao(obj.getDescricao());
        oldObject.setProcessamento(obj.getProcessamento());

        return campoLaudoMicroscopiaServiceInterface.updateCampoLaudoMicroscopia(oldObject);
    }


    public CampoLaudoMicroscopia findCampoLaudoMicroscopiaById(Long id) {
        return campoLaudoMicroscopiaServiceInterface.findCampoLaudoMicroscopiaById(id);
    }

    public List<CampoLaudoMicroscopia> getAllCampoLaudoMicroscopia() {
        return campoLaudoMicroscopiaServiceInterface.getAllCampoLaudoMicroscopia();
    }

    @Transactional
    public void deleteCampoLaudoMicroscopia(long id) {
        campoLaudoMicroscopiaServiceInterface.deleteCampoLaudoMicroscopia(id);
    }
}
