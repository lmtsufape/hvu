package br.edu.ufape.hvu.facade;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
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

@Service
public class Facade {
	// Tutor--------------------------------------------------------------
	@Autowired
	private TutorServiceInterface tutorServiceInterface;

	public Tutor saveTutor(Tutor newInstance) throws ResponseStatusException {
		return tutorServiceInterface.saveTutor(newInstance);
	}

	public Tutor updateTutor(Tutor transientObject) {
		return tutorServiceInterface.updateTutor(transientObject);
	}

	public Tutor findTutorById(long id) {
		return tutorServiceInterface.findTutorById(id);
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

	public void deleteTutor(long id) {
		tutorServiceInterface.deleteTutor(id);
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

		public Cancelamento saveCancelamento(Cancelamento newInstance) {
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

		public Cancelamento updateCancelamento(Cancelamento transientObject) {
			return cancelamentoServiceInterface.updateCancelamento(transientObject);
		}

		public Cancelamento findCancelamentoById(long id) {
			return cancelamentoServiceInterface.findCancelamentoById(id);
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

	public Usuario updateUsuario(Usuario transientObject) {
		return usuarioServiceInterface.updateUsuario(transientObject);
	}

	public Usuario findUsuarioById(long id) {
		return usuarioServiceInterface.findUsuarioById(id);
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
			if (usuario instanceof Diretor) {
				throw new DuplicateAccountException("diretor");
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

	// MedicacaoPeriodica--------------------------------------------------------------
	@Autowired
	private MedicacaoPeriodicaServiceInterface medicacaoPeriodicaServiceInterface;

	public MedicacaoPeriodica saveMedicacaoPeriodica(MedicacaoPeriodica newInstance) {
		return medicacaoPeriodicaServiceInterface.saveMedicacaoPeriodica(newInstance);
	}

	public MedicacaoPeriodica updateMedicacaoPeriodica(MedicacaoPeriodica transientObject) {
		return medicacaoPeriodicaServiceInterface.updateMedicacaoPeriodica(transientObject);
	}

	public MedicacaoPeriodica findMedicacaoPeriodicaById(long id) {
		return medicacaoPeriodicaServiceInterface.findMedicacaoPeriodicaById(id);
	}

	public List<MedicacaoPeriodica> getAllMedicacaoPeriodica() {
		return medicacaoPeriodicaServiceInterface.getAllMedicacaoPeriodica();
	}

	public void deleteMedicacaoPeriodica(MedicacaoPeriodica persistentObject) {
		medicacaoPeriodicaServiceInterface.deleteMedicacaoPeriodica(persistentObject);
	}

	public void deleteMedicacaoPeriodica(long id) {
		medicacaoPeriodicaServiceInterface.deleteMedicacaoPeriodica(id);
	}

	// AvaliacaoFisicoGeral--------------------------------------------------------------
	@Autowired
	private AvaliacaoFisicoGeralServiceInterface avaliacaoFisicoGeralServiceInterface;

	public AvaliacaoFisicoGeral saveAvaliacaoFisicoGeral(AvaliacaoFisicoGeral newInstance) {
		return avaliacaoFisicoGeralServiceInterface.saveAvaliacaoFisicoGeral(newInstance);
	}

	public AvaliacaoFisicoGeral updateAvaliacaoFisicoGeral(AvaliacaoFisicoGeral transientObject) {
		return avaliacaoFisicoGeralServiceInterface.updateAvaliacaoFisicoGeral(transientObject);
	}

	public AvaliacaoFisicoGeral findAvaliacaoFisicoGeralById(long id) {
		return avaliacaoFisicoGeralServiceInterface.findAvaliacaoFisicoGeralById(id);
	}

	public List<AvaliacaoFisicoGeral> getAllAvaliacaoFisicoGeral() {
		return avaliacaoFisicoGeralServiceInterface.getAllAvaliacaoFisicoGeral();
	}

	public void deleteAvaliacaoFisicoGeral(AvaliacaoFisicoGeral persistentObject) {
		avaliacaoFisicoGeralServiceInterface.deleteAvaliacaoFisicoGeral(persistentObject);
	}

	public void deleteAvaliacaoFisicoGeral(long id) {
		avaliacaoFisicoGeralServiceInterface.deleteAvaliacaoFisicoGeral(id);
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

	// TipoPrognostico--------------------------------------------------------------
	@Autowired
	private TipoPrognosticoServiceInterface tipoPrognosticoServiceInterface;

	public TipoPrognostico saveTipoPrognostico(TipoPrognostico newInstance) {
		return tipoPrognosticoServiceInterface.saveTipoPrognostico(newInstance);
	}

	public TipoPrognostico updateTipoPrognostico(TipoPrognostico transientObject) {
		return tipoPrognosticoServiceInterface.updateTipoPrognostico(transientObject);
	}

	public TipoPrognostico findTipoPrognosticoById(long id) {
		return tipoPrognosticoServiceInterface.findTipoPrognosticoById(id);
	}

	public List<TipoPrognostico> getAllTipoPrognostico() {
		return tipoPrognosticoServiceInterface.getAllTipoPrognostico();
	}

	public void deleteTipoPrognostico(TipoPrognostico persistentObject) {
		tipoPrognosticoServiceInterface.deleteTipoPrognostico(persistentObject);
	}

	public void deleteTipoPrognostico(long id) {
		tipoPrognosticoServiceInterface.deleteTipoPrognostico(id);
	}

	// Medico--------------------------------------------------------------
	@Autowired
	private MedicoServiceInterface medicoService;

	public Medico saveMedico(Medico newInstance) {
		return medicoService.saveMedico(newInstance);
	}

	public Medico updateMedico(Medico transientObject) {
		return medicoService.updateMedico(transientObject);
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
		medicoService.deleteMedico(persistentObject);
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

	// TipoExame--------------------------------------------------------------
	@Autowired
	private TipoExameServiceInterface tipoExameServiceInterface;

	public TipoExame saveTipoExame(TipoExame newInstance) {
		return tipoExameServiceInterface.saveTipoExame(newInstance);
	}

	public TipoExame updateTipoExame(TipoExame transientObject) {
		return tipoExameServiceInterface.updateTipoExame(transientObject);
	}

	public TipoExame findTipoExameById(long id) {
		return tipoExameServiceInterface.findTipoExameById(id);
	}

	public List<TipoExame> getAllTipoExame() {
		return tipoExameServiceInterface.getAllTipoExame();
	}

	public void deleteTipoExame(TipoExame persistentObject) {
		tipoExameServiceInterface.deleteTipoExame(persistentObject);
	}

	public void deleteTipoExame(long id) {
		tipoExameServiceInterface.deleteTipoExame(id);
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
	
	public boolean isAnimalWithRetorno(Long id) {
		Animal animal = findAnimalById(id);
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
	public List<Vaga> createVagasByTurno(VagaCreateRequest vagaRequestDTO) {
	    List<Vaga> vagas = new ArrayList<>();
		
		createVagas(vagaRequestDTO.getData(), vagaRequestDTO.getTurnoManha(), "Manhã", vagas);
	    createVagas(vagaRequestDTO.getData(), vagaRequestDTO.getTurnoTarde(), "Tarde", vagas);
	    
	    return vagas;
	}

	private void createVagas(LocalDate data, List<VagaTipoRequest> vagaTipo, String turno, List<Vaga> vagas) {

	    final long[] count = new long[2];
	    count[0] = findVagaByData(data).size(); // Total vagas no dia
	    count[1] = findVagaByDataAndTurno(data, turno).size(); // Total vagas no turno

	    if (count[0] >= 8 || count[1] >= 4) {
	        throw new RuntimeException("Número máximo de vagas para o dia ou turno já foi atingido.");
	    }

	    vagaTipo.forEach(especialidadeTipo -> {
	        Especialidade especialidade = findEspecialidadeById(especialidadeTipo.getEspecialidade().getId());
	        TipoConsulta tipoConsulta = findTipoConsultaById(especialidadeTipo.getTipoConsulta().getId());	        
	        
	        Map<LocalDateTime, List<Cronograma>> schedulesAvailable = scheduleAvailable(data, turno, especialidade);
	            
	        
	        for (Map.Entry<LocalDateTime, List<Cronograma>> entry : schedulesAvailable.entrySet()) {
	            LocalDateTime horario = entry.getKey();
	            List<Cronograma> cronogramas = entry.getValue();
	            
	            for (Cronograma cronograma : cronogramas) { 
	                if (count[0] < 8 && count[1] < 4) {
	                    Vaga newVaga = new Vaga();
	                    newVaga.setDataHora(horario);
	                    newVaga.setEspecialidade(especialidade);
	                    newVaga.setStatus("Disponível");
	                    newVaga.setMedico(cronograma.getMedico());
	                    newVaga.setTipoConsulta(tipoConsulta);
	                    saveVaga(newVaga);
	                    vagas.add(newVaga);
	                    count[0]++;
	                    count[1]++;
	                    break;
	                } else {
	                    break; 
	                }
	                
	            }
	            break;
	        }
	        	
                
	           
	        });
	    }
	


	// Medicamento--------------------------------------------------------------
	@Autowired
	private MedicamentoServiceInterface medicamentoServiceInterface;

	public Medicamento saveMedicamento(Medicamento newInstance) {
		return medicamentoServiceInterface.saveMedicamento(newInstance);
	}

	public Medicamento updateMedicamento(Medicamento transientObject) {
		return medicamentoServiceInterface.updateMedicamento(transientObject);
	}

	public Medicamento findMedicamentoById(long id) {
		return medicamentoServiceInterface.findMedicamentoById(id);
	}

	public List<Medicamento> getAllMedicamento() {
		return medicamentoServiceInterface.getAllMedicamento();
	}

	public void deleteMedicamento(Medicamento persistentObject) {
		medicamentoServiceInterface.deleteMedicamento(persistentObject);
	}

	public void deleteMedicamento(long id) {
		medicamentoServiceInterface.deleteMedicamento(id);
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

	// TipoMucosa--------------------------------------------------------------
	@Autowired
	private TipoMucosaServiceInterface tipoMucosaServiceInterface;

	public TipoMucosa saveTipoMucosa(TipoMucosa newInstance) {
		return tipoMucosaServiceInterface.saveTipoMucosa(newInstance);
	}

	public TipoMucosa updateTipoMucosa(TipoMucosa transientObject) {
		return tipoMucosaServiceInterface.updateTipoMucosa(transientObject);
	}

	public TipoMucosa findTipoMucosaById(long id) {
		return tipoMucosaServiceInterface.findTipoMucosaById(id);
	}

	public List<TipoMucosa> getAllTipoMucosa() {
		return tipoMucosaServiceInterface.getAllTipoMucosa();
	}

	public void deleteTipoMucosa(TipoMucosa persistentObject) {
		tipoMucosaServiceInterface.deleteTipoMucosa(persistentObject);
	}

	public void deleteTipoMucosa(long id) {
		tipoMucosaServiceInterface.deleteTipoMucosa(id);
	}

	// Consulta--------------------------------------------------------------
	@Autowired
	private ConsultaServiceInterface consultaServiceInterface;

	public Consulta saveConsulta(Consulta newInstance) {
		return consultaServiceInterface.saveConsulta(newInstance);
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

	public void deleteConsulta(Consulta persistentObject) {
		consultaServiceInterface.deleteConsulta(persistentObject);
	}

	public void deleteConsulta(long id) {
		consultaServiceInterface.deleteConsulta(id);
	}

	// HistoricoMedicoPregresso--------------------------------------------------------------
	@Autowired
	private HistoricoMedicoPregressoServiceInterface historicoMedicoPregressoServiceInterface;

	public HistoricoMedicoPregresso saveHistoricoMedicoPregresso(HistoricoMedicoPregresso newInstance) {
		return historicoMedicoPregressoServiceInterface.saveHistoricoMedicoPregresso(newInstance);
	}

	public HistoricoMedicoPregresso updateHistoricoMedicoPregresso(HistoricoMedicoPregresso transientObject) {
		return historicoMedicoPregressoServiceInterface.updateHistoricoMedicoPregresso(transientObject);
	}

	public HistoricoMedicoPregresso findHistoricoMedicoPregressoById(long id) {
		return historicoMedicoPregressoServiceInterface.findHistoricoMedicoPregressoById(id);
	}

	public List<HistoricoMedicoPregresso> getAllHistoricoMedicoPregresso() {
		return historicoMedicoPregressoServiceInterface.getAllHistoricoMedicoPregresso();
	}

	public void deleteHistoricoMedicoPregresso(HistoricoMedicoPregresso persistentObject) {
		historicoMedicoPregressoServiceInterface.deleteHistoricoMedicoPregresso(persistentObject);
	}

	public void deleteHistoricoMedicoPregresso(long id) {
		historicoMedicoPregressoServiceInterface.deleteHistoricoMedicoPregresso(id);
	}

	// ExameComplementar--------------------------------------------------------------
	@Autowired
	private ExameComplementarServiceInterface exameComplementarServiceInterface;

	public ExameComplementar saveExameComplementar(ExameComplementar newInstance) {
		return exameComplementarServiceInterface.saveExameComplementar(newInstance);
	}

	public ExameComplementar updateExameComplementar(ExameComplementar transientObject) {
		return exameComplementarServiceInterface.updateExameComplementar(transientObject);
	}

	public ExameComplementar findExameComplementarById(long id) {
		return exameComplementarServiceInterface.findExameComplementarById(id);
	}

	public List<ExameComplementar> getAllExameComplementar() {
		return exameComplementarServiceInterface.getAllExameComplementar();
	}

	public void deleteExameComplementar(ExameComplementar persistentObject) {
		exameComplementarServiceInterface.deleteExameComplementar(persistentObject);
	}

	public void deleteExameComplementar(long id) {
		exameComplementarServiceInterface.deleteExameComplementar(id);
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
		
		agendamento.setAnimal(findAnimalById(newObject.getAnimal().getId()));
		agendamento.setTipoEspecial(newObject.isTipoEspecial());		
		
		return saveAgendamento(agendamento, vaga.getId());
	}

	public Agendamento updateAgendamento(Agendamento transientObject) {
		return agendamentoServiceInterface.updateAgendamento(transientObject);
	}

	public Agendamento findAgendamentoById(long id) {
		return agendamentoServiceInterface.findAgendamentoById(id);
	}

	public List<Agendamento> getAllAgendamento() {
		return agendamentoServiceInterface.getAllAgendamento();
	}
	
	public List<Agendamento> findAgendamentosByMedicoId(Long medicoId){
		Medico medico = findMedicoById(medicoId);
		return agendamentoServiceInterface.findAgendamentosByMedicoId(medico.getId());
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

	public void deleteAgendamento(Agendamento persistentObject) {
		agendamentoServiceInterface.deleteAgendamento(persistentObject);
	}

	public void deleteAgendamento(long id) {
		agendamentoServiceInterface.deleteAgendamento(id);
	}

	// TipoLinfonodos--------------------------------------------------------------
	@Autowired
	private TipoLinfonodosServiceInterface tipoLinfonodosServiceInterface;

	public TipoLinfonodos saveTipoLinfonodos(TipoLinfonodos newInstance) {
		return tipoLinfonodosServiceInterface.saveTipoLinfonodos(newInstance);
	}

	public TipoLinfonodos updateTipoLinfonodos(TipoLinfonodos transientObject) {
		return tipoLinfonodosServiceInterface.updateTipoLinfonodos(transientObject);
	}

	public TipoLinfonodos findTipoLinfonodosById(long id) {
		return tipoLinfonodosServiceInterface.findTipoLinfonodosById(id);
	}

	public List<TipoLinfonodos> getAllTipoLinfonodos() {
		return tipoLinfonodosServiceInterface.getAllTipoLinfonodos();
	}

	public void deleteTipoLinfonodos(TipoLinfonodos persistentObject) {
		tipoLinfonodosServiceInterface.deleteTipoLinfonodos(persistentObject);
	}

	public void deleteTipoLinfonodos(long id) {
		tipoLinfonodosServiceInterface.deleteTipoLinfonodos(id);
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

	// AvaliacaoFisicoEspecial--------------------------------------------------------------
	@Autowired
	private AvaliacaoFisicoEspecialServiceInterface avaliacaoFisicoEspecialServiceInterface;

	public AvaliacaoFisicoEspecial saveAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial newInstance) {
		return avaliacaoFisicoEspecialServiceInterface.saveAvaliacaoFisicoEspecial(newInstance);
	}

	public AvaliacaoFisicoEspecial updateAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial transientObject) {
		return avaliacaoFisicoEspecialServiceInterface.updateAvaliacaoFisicoEspecial(transientObject);
	}

	public AvaliacaoFisicoEspecial findAvaliacaoFisicoEspecialById(long id) {
		return avaliacaoFisicoEspecialServiceInterface.findAvaliacaoFisicoEspecialById(id);
	}

	public List<AvaliacaoFisicoEspecial> getAllAvaliacaoFisicoEspecial() {
		return avaliacaoFisicoEspecialServiceInterface.getAllAvaliacaoFisicoEspecial();
	}

	public void deleteAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial persistentObject) {
		avaliacaoFisicoEspecialServiceInterface.deleteAvaliacaoFisicoEspecial(persistentObject);
	}

	public void deleteAvaliacaoFisicoEspecial(long id) {
		avaliacaoFisicoEspecialServiceInterface.deleteAvaliacaoFisicoEspecial(id);
	}

	// NivelConsciencia--------------------------------------------------------------
	@Autowired
	private NivelConscienciaServiceInterface nivelConscienciaServiceInterface;

	public NivelConsciencia saveNivelConsciencia(NivelConsciencia newInstance) {
		return nivelConscienciaServiceInterface.saveNivelConsciencia(newInstance);
	}

	public NivelConsciencia updateNivelConsciencia(NivelConsciencia transientObject) {
		return nivelConscienciaServiceInterface.updateNivelConsciencia(transientObject);
	}

	public NivelConsciencia findNivelConscienciaById(long id) {
		return nivelConscienciaServiceInterface.findNivelConscienciaById(id);
	}

	public List<NivelConsciencia> getAllNivelConsciencia() {
		return nivelConscienciaServiceInterface.getAllNivelConsciencia();
	}

	public void deleteNivelConsciencia(NivelConsciencia persistentObject) {
		nivelConscienciaServiceInterface.deleteNivelConsciencia(persistentObject);
	}

	public void deleteNivelConsciencia(long id) {
		nivelConscienciaServiceInterface.deleteNivelConsciencia(id);
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

	// TipoPostura--------------------------------------------------------------
	@Autowired
	private TipoPosturaServiceInterface tipoPosturaServiceInterface;

	public TipoPostura saveTipoPostura(TipoPostura newInstance) {
		return tipoPosturaServiceInterface.saveTipoPostura(newInstance);
	}

	public TipoPostura updateTipoPostura(TipoPostura transientObject) {
		return tipoPosturaServiceInterface.updateTipoPostura(transientObject);
	}

	public TipoPostura findTipoPosturaById(long id) {
		return tipoPosturaServiceInterface.findTipoPosturaById(id);
	}

	public List<TipoPostura> getAllTipoPostura() {
		return tipoPosturaServiceInterface.getAllTipoPostura();
	}

	public void deleteTipoPostura(TipoPostura persistentObject) {
		tipoPosturaServiceInterface.deleteTipoPostura(persistentObject);
	}

	public void deleteTipoPostura(long id) {
		tipoPosturaServiceInterface.deleteTipoPostura(id);
	}

	// Diretor--------------------------------------------------------------
	@Autowired
	private DiretorServiceInterface diretorServiceInterface;

	public Diretor saveDiretor(Diretor newInstance) {
		return diretorServiceInterface.saveDiretor(newInstance);
	}

	public Diretor updateDiretor(Diretor transientObject) {
		return diretorServiceInterface.updateDiretor(transientObject);
	}

	public Diretor findDiretorById(long id) {
		return diretorServiceInterface.findDiretorById(id);
	}

	public Diretor findDiretorByuserId(String userId) {
		return diretorServiceInterface.findDiretorByuserId(userId);
	}

	public List<Diretor> getAllDiretor() {
		return diretorServiceInterface.getAllDiretor();
	}

	public void deleteDiretor(Diretor persistentObject) {
		diretorServiceInterface.deleteDiretor(persistentObject);
	}

	public void deleteDiretor(long id) {
		diretorServiceInterface.deleteDiretor(id);
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

	public Animal updateAnimal(Animal transientObject) {
		return animalServiceInterface.updateAnimal(transientObject);
	}

	public Animal findAnimalById(long id) {
		return animalServiceInterface.findAnimalById(id);
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

	// TipoTurgorCutaneo--------------------------------------------------------------
	@Autowired
	private TipoTurgorCutaneoServiceInterface tipoTurgorCutaneoServiceInterface;

	public TipoTurgorCutaneo saveTipoTurgorCutaneo(TipoTurgorCutaneo newInstance) {
		return tipoTurgorCutaneoServiceInterface.saveTipoTurgorCutaneo(newInstance);
	}

	public TipoTurgorCutaneo updateTipoTurgorCutaneo(TipoTurgorCutaneo transientObject) {
		return tipoTurgorCutaneoServiceInterface.updateTipoTurgorCutaneo(transientObject);
	}

	public TipoTurgorCutaneo findTipoTurgorCutaneoById(long id) {
		return tipoTurgorCutaneoServiceInterface.findTipoTurgorCutaneoById(id);
	}

	public List<TipoTurgorCutaneo> getAllTipoTurgorCutaneo() {
		return tipoTurgorCutaneoServiceInterface.getAllTipoTurgorCutaneo();
	}

	public void deleteTipoTurgorCutaneo(TipoTurgorCutaneo persistentObject) {
		tipoTurgorCutaneoServiceInterface.deleteTipoTurgorCutaneo(persistentObject);
	}

	public void deleteTipoTurgorCutaneo(long id) {
		tipoTurgorCutaneoServiceInterface.deleteTipoTurgorCutaneo(id);
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
	CampoLaudoServiceInterface campoLaudoServiceInterface;

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
	EtapaServiceInterface etapaServiceInterface;

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

	// ExameMicroscopia--------------------------------------------------------------
	@Autowired
	ExameMicroscopicoServiceInterface exameMicroscopicoServiceInterface;

	public ExameMicroscopico saveExameMicroscopico(ExameMicroscopico newInstance) {
		return exameMicroscopicoServiceInterface.saveExameMicroscopico(newInstance);
	}

	public List<ExameMicroscopico> getAllExameMicroscopico() {
		return exameMicroscopicoServiceInterface.getAllExameMicroscopico();
	}

	public ExameMicroscopico updateExameMicroscopico(ExameMicroscopico transientObject) {
		return exameMicroscopicoServiceInterface.updateExameMicroscopico(transientObject);
	}

	public ExameMicroscopico findExameMicroscopicoById(long id) {
		return exameMicroscopicoServiceInterface.findExameMicroscopicoById(id);
	}

	public void deleteExameMicroscopico(long id) {
		exameMicroscopicoServiceInterface.deleteExameMicroscopico(id);
	}

	public void deleteExameMicroscopico(ExameMicroscopico persistentObject) {
		exameMicroscopicoServiceInterface.deleteExameMicroscopico(persistentObject);
	}

	// FichaSolicitacaoServico--------------------------------------------------------------

	@Autowired
	FichaSolicitacaoServicoServiceInterface fichaSolicitacaoServicoServiceInterface;

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

	FotoServiceInterface fotoServiceInterface;

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
	InstituicaoServiceInterface instituicaoServiceInterface;

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

	// LaudoMicroscopia--------------------------------------------------------------

	@Autowired
	LaudoMicroscopiaServiceInterface laudoMicroscopiaServiceInterface;

	public LaudoMicroscopia saveLaudoMicroscopia(LaudoMicroscopia newInstance) {
		return laudoMicroscopiaServiceInterface.saveLaudoMicroscopia(newInstance);
	}

	public LaudoMicroscopia updateLaudoMicroscopia(LaudoMicroscopia transientObject) {
		return laudoMicroscopiaServiceInterface.updateLaudoMicroscopia(transientObject);
	}

	public LaudoMicroscopia findLaudoMicroscopiaById(long id) {
		return laudoMicroscopiaServiceInterface.findLaudoMicroscopiaById(id);
	}

	public List<LaudoMicroscopia> getAllLaudoMicroscopia() {
		return laudoMicroscopiaServiceInterface.getAllLaudoMicroscopia();
	}

	public void deleteLaudoMicroscopia(LaudoMicroscopia persistentObject) {
		laudoMicroscopiaServiceInterface.deleteLaudoMicroscopia(persistentObject);
	}

	public void deleteLaudoMicroscopia(long id) {
		laudoMicroscopiaServiceInterface.deleteLaudoMicroscopia(id);
	}

	// LaudoNecropsia--------------------------------------------------------------
	@Autowired
	LaudoNecropsiaServiceInterface laudoNecropsiaServiceInterfcae;

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

	// LivroRegistro--------------------------------------------------------------
	@Autowired
	LivroRegistroServiceInterface livroRegistroServiceInterface;

	public LivroRegistro saveLivroRegistro(LivroRegistro newInstance) {
		return livroRegistroServiceInterface.saveLivroRegistro(newInstance);
	}

	public LivroRegistro updateLivroRegistro(LivroRegistro transientObject) {
		return livroRegistroServiceInterface.updateLivroRegistro(transientObject);
	}

	public LivroRegistro findLivroRegistroById(long id) {
		return livroRegistroServiceInterface.findLivroRegistroById(id);
	}

	public List<LivroRegistro> getAllLivroRegistro() {
		return livroRegistroServiceInterface.getAllLivroRegistro();
	}

	public void deleteLivroRegistro(LivroRegistro persistentObject) {
		livroRegistroServiceInterface.deleteLivroRegistro(persistentObject);
	}

	public void deleteLivroRegistro(long id) {
		livroRegistroServiceInterface.deleteLivroRegistro(id);
	}

	// MaterialColetado--------------------------------------------------------------
	@Autowired

	MaterialColetadoServiceInterface materialColetadoServiceInterface;

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

	OrgaoServiceInterface OrgaoServiceInterface;

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

	RotinaServiceInterface RotinaServiceInterface;

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

}
