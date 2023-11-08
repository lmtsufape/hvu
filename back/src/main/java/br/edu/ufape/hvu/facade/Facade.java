package br.edu.ufape.hvu.facade;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.edu.ufape.hvu.model.*;
import br.edu.ufape.hvu.service.*;

@Service
public class Facade {
	//Tutor--------------------------------------------------------------
	@Autowired
	private TutorService  tutorService;
		
	public Tutor saveTutor(Tutor newInstance) {
		return tutorService.saveTutor(newInstance);
	}

	public Tutor updateTutor(Tutor transientObject) {
		return tutorService.updateTutor(transientObject);
	}

	public Tutor findTutorById(long id) {
		return tutorService.findTutorById(id);
	}

	public List<Tutor> getAllTutor() {
		return tutorService.getAllTutor();
	}

	public void deleteTutor(Tutor persistentObject) {
		tutorService.deleteTutor(persistentObject);
	}

	public void deleteTutor(long id) {
		tutorService.deleteTutor(id);
	}
	

	//NivelHidratacao--------------------------------------------------------------
	@Autowired
	private NivelHidratacaoService  nivelHidratacaoService;
		
	public NivelHidratacao saveNivelHidratacao(NivelHidratacao newInstance) {
		return nivelHidratacaoService.saveNivelHidratacao(newInstance);
	}

	public NivelHidratacao updateNivelHidratacao(NivelHidratacao transientObject) {
		return nivelHidratacaoService.updateNivelHidratacao(transientObject);
	}

	public NivelHidratacao findNivelHidratacaoById(long id) {
		return nivelHidratacaoService.findNivelHidratacaoById(id);
	}

	public List<NivelHidratacao> getAllNivelHidratacao() {
		return nivelHidratacaoService.getAllNivelHidratacao();
	}

	public void deleteNivelHidratacao(NivelHidratacao persistentObject) {
		nivelHidratacaoService.deleteNivelHidratacao(persistentObject);
	}

	public void deleteNivelHidratacao(long id) {
		nivelHidratacaoService.deleteNivelHidratacao(id);
	}
	

	//TipoConsulta--------------------------------------------------------------
	@Autowired
	private TipoConsultaService  tipoConsultaService;
		
	public TipoConsulta saveTipoConsulta(TipoConsulta newInstance) {
		return tipoConsultaService.saveTipoConsulta(newInstance);
	}

	public TipoConsulta updateTipoConsulta(TipoConsulta transientObject) {
		return tipoConsultaService.updateTipoConsulta(transientObject);
	}

	public TipoConsulta findTipoConsultaById(long id) {
		return tipoConsultaService.findTipoConsultaById(id);
	}

	public List<TipoConsulta> getAllTipoConsulta() {
		return tipoConsultaService.getAllTipoConsulta();
	}

	public void deleteTipoConsulta(TipoConsulta persistentObject) {
		tipoConsultaService.deleteTipoConsulta(persistentObject);
	}

	public void deleteTipoConsulta(long id) {
		tipoConsultaService.deleteTipoConsulta(id);
	}
	

	//Usuario--------------------------------------------------------------
	@Autowired
	private UsuarioService  usuarioService;
		
	public Usuario saveUsuario(Usuario newInstance) {
		return usuarioService.saveUsuario(newInstance);
	}

	public Usuario updateUsuario(Usuario transientObject) {
		return usuarioService.updateUsuario(transientObject);
	}

	public Usuario findUsuarioById(long id) {
		return usuarioService.findUsuarioById(id);
	}

	public List<Usuario> getAllUsuario() {
		return usuarioService.getAllUsuario();
	}

	public void deleteUsuario(Usuario persistentObject) {
		usuarioService.deleteUsuario(persistentObject);
	}

	public void deleteUsuario(long id) {
		usuarioService.deleteUsuario(id);
	}
	

	//MedicacaoPeriodica--------------------------------------------------------------
	@Autowired
	private MedicacaoPeriodicaService  medicacaoPeriodicaService;
		
	public MedicacaoPeriodica saveMedicacaoPeriodica(MedicacaoPeriodica newInstance) {
		return medicacaoPeriodicaService.saveMedicacaoPeriodica(newInstance);
	}

	public MedicacaoPeriodica updateMedicacaoPeriodica(MedicacaoPeriodica transientObject) {
		return medicacaoPeriodicaService.updateMedicacaoPeriodica(transientObject);
	}

	public MedicacaoPeriodica findMedicacaoPeriodicaById(long id) {
		return medicacaoPeriodicaService.findMedicacaoPeriodicaById(id);
	}

	public List<MedicacaoPeriodica> getAllMedicacaoPeriodica() {
		return medicacaoPeriodicaService.getAllMedicacaoPeriodica();
	}

	public void deleteMedicacaoPeriodica(MedicacaoPeriodica persistentObject) {
		medicacaoPeriodicaService.deleteMedicacaoPeriodica(persistentObject);
	}

	public void deleteMedicacaoPeriodica(long id) {
		medicacaoPeriodicaService.deleteMedicacaoPeriodica(id);
	}
	

	//AvaliacaoFisicoGeral--------------------------------------------------------------
	@Autowired
	private AvaliacaoFisicoGeralService  avaliacaoFisicoGeralService;
		
	public AvaliacaoFisicoGeral saveAvaliacaoFisicoGeral(AvaliacaoFisicoGeral newInstance) {
		return avaliacaoFisicoGeralService.saveAvaliacaoFisicoGeral(newInstance);
	}

	public AvaliacaoFisicoGeral updateAvaliacaoFisicoGeral(AvaliacaoFisicoGeral transientObject) {
		return avaliacaoFisicoGeralService.updateAvaliacaoFisicoGeral(transientObject);
	}

	public AvaliacaoFisicoGeral findAvaliacaoFisicoGeralById(long id) {
		return avaliacaoFisicoGeralService.findAvaliacaoFisicoGeralById(id);
	}

	public List<AvaliacaoFisicoGeral> getAllAvaliacaoFisicoGeral() {
		return avaliacaoFisicoGeralService.getAllAvaliacaoFisicoGeral();
	}

	public void deleteAvaliacaoFisicoGeral(AvaliacaoFisicoGeral persistentObject) {
		avaliacaoFisicoGeralService.deleteAvaliacaoFisicoGeral(persistentObject);
	}

	public void deleteAvaliacaoFisicoGeral(long id) {
		avaliacaoFisicoGeralService.deleteAvaliacaoFisicoGeral(id);
	}
	

	//Cronograma--------------------------------------------------------------
	@Autowired
	private CronogramaService  cronogramaService;
		
	public Cronograma saveCronograma(Cronograma newInstance) {
		return cronogramaService.saveCronograma(newInstance);
	}

	public Cronograma updateCronograma(Cronograma transientObject) {
		return cronogramaService.updateCronograma(transientObject);
	}

	public Cronograma findCronogramaById(long id) {
		return cronogramaService.findCronogramaById(id);
	}

	public List<Cronograma> getAllCronograma() {
		return cronogramaService.getAllCronograma();
	}

	public void deleteCronograma(Cronograma persistentObject) {
		cronogramaService.deleteCronograma(persistentObject);
	}

	public void deleteCronograma(long id) {
		cronogramaService.deleteCronograma(id);
	}
	

	//TipoPrognostico--------------------------------------------------------------
	@Autowired
	private TipoPrognosticoService  tipoPrognosticoService;
		
	public TipoPrognostico saveTipoPrognostico(TipoPrognostico newInstance) {
		return tipoPrognosticoService.saveTipoPrognostico(newInstance);
	}

	public TipoPrognostico updateTipoPrognostico(TipoPrognostico transientObject) {
		return tipoPrognosticoService.updateTipoPrognostico(transientObject);
	}

	public TipoPrognostico findTipoPrognosticoById(long id) {
		return tipoPrognosticoService.findTipoPrognosticoById(id);
	}

	public List<TipoPrognostico> getAllTipoPrognostico() {
		return tipoPrognosticoService.getAllTipoPrognostico();
	}

	public void deleteTipoPrognostico(TipoPrognostico persistentObject) {
		tipoPrognosticoService.deleteTipoPrognostico(persistentObject);
	}

	public void deleteTipoPrognostico(long id) {
		tipoPrognosticoService.deleteTipoPrognostico(id);
	}
	

	//Medico--------------------------------------------------------------
	@Autowired
	private MedicoService  medicoService;
		
	public Medico saveMedico(Medico newInstance) {
		return medicoService.saveMedico(newInstance);
	}

	public Medico updateMedico(Medico transientObject) {
		return medicoService.updateMedico(transientObject);
	}

	public Medico findMedicoById(long id) {
		return medicoService.findMedicoById(id);
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
	

	//TipoExame--------------------------------------------------------------
	@Autowired
	private TipoExameService  tipoExameService;
		
	public TipoExame saveTipoExame(TipoExame newInstance) {
		return tipoExameService.saveTipoExame(newInstance);
	}

	public TipoExame updateTipoExame(TipoExame transientObject) {
		return tipoExameService.updateTipoExame(transientObject);
	}

	public TipoExame findTipoExameById(long id) {
		return tipoExameService.findTipoExameById(id);
	}

	public List<TipoExame> getAllTipoExame() {
		return tipoExameService.getAllTipoExame();
	}

	public void deleteTipoExame(TipoExame persistentObject) {
		tipoExameService.deleteTipoExame(persistentObject);
	}

	public void deleteTipoExame(long id) {
		tipoExameService.deleteTipoExame(id);
	}
	

	//Raca--------------------------------------------------------------
	@Autowired
	private RacaService  racaService;
		
	public Raca saveRaca(Raca newInstance) {
		return racaService.saveRaca(newInstance);
	}

	public Raca updateRaca(Raca transientObject) {
		return racaService.updateRaca(transientObject);
	}

	public Raca findRacaById(long id) {
		return racaService.findRacaById(id);
	}

	public List<Raca> getAllRaca() {
		return racaService.getAllRaca();
	}

	public void deleteRaca(Raca persistentObject) {
		racaService.deleteRaca(persistentObject);
	}

	public void deleteRaca(long id) {
		racaService.deleteRaca(id);
	}
	

	//Vaga--------------------------------------------------------------
	@Autowired
	private VagaService  vagaService;
		
	public Vaga saveVaga(Vaga newInstance) {
		return vagaService.saveVaga(newInstance);
	}

	public Vaga updateVaga(Vaga transientObject) {
		return vagaService.updateVaga(transientObject);
	}

	public Vaga findVagaById(long id) {
		return vagaService.findVagaById(id);
	}

	public List<Vaga> getAllVaga() {
		return vagaService.getAllVaga();
	}

	public void deleteVaga(Vaga persistentObject) {
		vagaService.deleteVaga(persistentObject);
	}

	public void deleteVaga(long id) {
		vagaService.deleteVaga(id);
	}
	

	//Medicamento--------------------------------------------------------------
	@Autowired
	private MedicamentoService  medicamentoService;
		
	public Medicamento saveMedicamento(Medicamento newInstance) {
		return medicamentoService.saveMedicamento(newInstance);
	}

	public Medicamento updateMedicamento(Medicamento transientObject) {
		return medicamentoService.updateMedicamento(transientObject);
	}

	public Medicamento findMedicamentoById(long id) {
		return medicamentoService.findMedicamentoById(id);
	}

	public List<Medicamento> getAllMedicamento() {
		return medicamentoService.getAllMedicamento();
	}

	public void deleteMedicamento(Medicamento persistentObject) {
		medicamentoService.deleteMedicamento(persistentObject);
	}

	public void deleteMedicamento(long id) {
		medicamentoService.deleteMedicamento(id);
	}
	

	//Prescricao--------------------------------------------------------------
	@Autowired
	private PrescricaoService  prescricaoService;
		
	public Prescricao savePrescricao(Prescricao newInstance) {
		return prescricaoService.savePrescricao(newInstance);
	}

	public Prescricao updatePrescricao(Prescricao transientObject) {
		return prescricaoService.updatePrescricao(transientObject);
	}

	public Prescricao findPrescricaoById(long id) {
		return prescricaoService.findPrescricaoById(id);
	}

	public List<Prescricao> getAllPrescricao() {
		return prescricaoService.getAllPrescricao();
	}

	public void deletePrescricao(Prescricao persistentObject) {
		prescricaoService.deletePrescricao(persistentObject);
	}

	public void deletePrescricao(long id) {
		prescricaoService.deletePrescricao(id);
	}
	

	//TipoMucosa--------------------------------------------------------------
	@Autowired
	private TipoMucosaService  tipoMucosaService;
		
	public TipoMucosa saveTipoMucosa(TipoMucosa newInstance) {
		return tipoMucosaService.saveTipoMucosa(newInstance);
	}

	public TipoMucosa updateTipoMucosa(TipoMucosa transientObject) {
		return tipoMucosaService.updateTipoMucosa(transientObject);
	}

	public TipoMucosa findTipoMucosaById(long id) {
		return tipoMucosaService.findTipoMucosaById(id);
	}

	public List<TipoMucosa> getAllTipoMucosa() {
		return tipoMucosaService.getAllTipoMucosa();
	}

	public void deleteTipoMucosa(TipoMucosa persistentObject) {
		tipoMucosaService.deleteTipoMucosa(persistentObject);
	}

	public void deleteTipoMucosa(long id) {
		tipoMucosaService.deleteTipoMucosa(id);
	}
	

	//Consulta--------------------------------------------------------------
	@Autowired
	private ConsultaService  consultaService;
		
	public Consulta saveConsulta(Consulta newInstance) {
		return consultaService.saveConsulta(newInstance);
	}

	public Consulta updateConsulta(Consulta transientObject) {
		return consultaService.updateConsulta(transientObject);
	}

	public Consulta findConsultaById(long id) {
		return consultaService.findConsultaById(id);
	}

	public List<Consulta> getAllConsulta() {
		return consultaService.getAllConsulta();
	}

	public void deleteConsulta(Consulta persistentObject) {
		consultaService.deleteConsulta(persistentObject);
	}

	public void deleteConsulta(long id) {
		consultaService.deleteConsulta(id);
	}
	

	//HistoricoMedicoPregresso--------------------------------------------------------------
	@Autowired
	private HistoricoMedicoPregressoService  historicoMedicoPregressoService;
		
	public HistoricoMedicoPregresso saveHistoricoMedicoPregresso(HistoricoMedicoPregresso newInstance) {
		return historicoMedicoPregressoService.saveHistoricoMedicoPregresso(newInstance);
	}

	public HistoricoMedicoPregresso updateHistoricoMedicoPregresso(HistoricoMedicoPregresso transientObject) {
		return historicoMedicoPregressoService.updateHistoricoMedicoPregresso(transientObject);
	}

	public HistoricoMedicoPregresso findHistoricoMedicoPregressoById(long id) {
		return historicoMedicoPregressoService.findHistoricoMedicoPregressoById(id);
	}

	public List<HistoricoMedicoPregresso> getAllHistoricoMedicoPregresso() {
		return historicoMedicoPregressoService.getAllHistoricoMedicoPregresso();
	}

	public void deleteHistoricoMedicoPregresso(HistoricoMedicoPregresso persistentObject) {
		historicoMedicoPregressoService.deleteHistoricoMedicoPregresso(persistentObject);
	}

	public void deleteHistoricoMedicoPregresso(long id) {
		historicoMedicoPregressoService.deleteHistoricoMedicoPregresso(id);
	}
	

	//ExameComplementar--------------------------------------------------------------
	@Autowired
	private ExameComplementarService  exameComplementarService;
		
	public ExameComplementar saveExameComplementar(ExameComplementar newInstance) {
		return exameComplementarService.saveExameComplementar(newInstance);
	}

	public ExameComplementar updateExameComplementar(ExameComplementar transientObject) {
		return exameComplementarService.updateExameComplementar(transientObject);
	}

	public ExameComplementar findExameComplementarById(long id) {
		return exameComplementarService.findExameComplementarById(id);
	}

	public List<ExameComplementar> getAllExameComplementar() {
		return exameComplementarService.getAllExameComplementar();
	}

	public void deleteExameComplementar(ExameComplementar persistentObject) {
		exameComplementarService.deleteExameComplementar(persistentObject);
	}

	public void deleteExameComplementar(long id) {
		exameComplementarService.deleteExameComplementar(id);
	}
	

	//Parecer--------------------------------------------------------------
	@Autowired
	private ParecerService  parecerService;
		
	public Parecer saveParecer(Parecer newInstance) {
		return parecerService.saveParecer(newInstance);
	}

	public Parecer updateParecer(Parecer transientObject) {
		return parecerService.updateParecer(transientObject);
	}

	public Parecer findParecerById(long id) {
		return parecerService.findParecerById(id);
	}

	public List<Parecer> getAllParecer() {
		return parecerService.getAllParecer();
	}

	public void deleteParecer(Parecer persistentObject) {
		parecerService.deleteParecer(persistentObject);
	}

	public void deleteParecer(long id) {
		parecerService.deleteParecer(id);
	}
	

	//Especialidade--------------------------------------------------------------
	@Autowired
	private EspecialidadeService  especialidadeService;
		
	public Especialidade saveEspecialidade(Especialidade newInstance) {
		return especialidadeService.saveEspecialidade(newInstance);
	}

	public Especialidade updateEspecialidade(Especialidade transientObject) {
		return especialidadeService.updateEspecialidade(transientObject);
	}

	public Especialidade findEspecialidadeById(long id) {
		return especialidadeService.findEspecialidadeById(id);
	}

	public List<Especialidade> getAllEspecialidade() {
		return especialidadeService.getAllEspecialidade();
	}

	public void deleteEspecialidade(Especialidade persistentObject) {
		especialidadeService.deleteEspecialidade(persistentObject);
	}

	public void deleteEspecialidade(long id) {
		especialidadeService.deleteEspecialidade(id);
	}
	

	//Agendamento--------------------------------------------------------------
	@Autowired
	private AgendamentoService  agendamentoService;
		
	public Agendamento saveAgendamento(Agendamento newInstance) {
		return agendamentoService.saveAgendamento(newInstance);
	}

	public Agendamento updateAgendamento(Agendamento transientObject) {
		return agendamentoService.updateAgendamento(transientObject);
	}

	public Agendamento findAgendamentoById(long id) {
		return agendamentoService.findAgendamentoById(id);
	}

	public List<Agendamento> getAllAgendamento() {
		return agendamentoService.getAllAgendamento();
	}

	public void deleteAgendamento(Agendamento persistentObject) {
		agendamentoService.deleteAgendamento(persistentObject);
	}

	public void deleteAgendamento(long id) {
		agendamentoService.deleteAgendamento(id);
	}
	

	//TipoLinfonodos--------------------------------------------------------------
	@Autowired
	private TipoLinfonodosService  tipoLinfonodosService;
		
	public TipoLinfonodos saveTipoLinfonodos(TipoLinfonodos newInstance) {
		return tipoLinfonodosService.saveTipoLinfonodos(newInstance);
	}

	public TipoLinfonodos updateTipoLinfonodos(TipoLinfonodos transientObject) {
		return tipoLinfonodosService.updateTipoLinfonodos(transientObject);
	}

	public TipoLinfonodos findTipoLinfonodosById(long id) {
		return tipoLinfonodosService.findTipoLinfonodosById(id);
	}

	public List<TipoLinfonodos> getAllTipoLinfonodos() {
		return tipoLinfonodosService.getAllTipoLinfonodos();
	}

	public void deleteTipoLinfonodos(TipoLinfonodos persistentObject) {
		tipoLinfonodosService.deleteTipoLinfonodos(persistentObject);
	}

	public void deleteTipoLinfonodos(long id) {
		tipoLinfonodosService.deleteTipoLinfonodos(id);
	}
	

	//Endereco--------------------------------------------------------------
	@Autowired
	private EnderecoService  enderecoService;
		
	public Endereco saveEndereco(Endereco newInstance) {
		return enderecoService.saveEndereco(newInstance);
	}

	public Endereco updateEndereco(Endereco transientObject) {
		return enderecoService.updateEndereco(transientObject);
	}

	public Endereco findEnderecoById(long id) {
		return enderecoService.findEnderecoById(id);
	}

	public List<Endereco> getAllEndereco() {
		return enderecoService.getAllEndereco();
	}

	public void deleteEndereco(Endereco persistentObject) {
		enderecoService.deleteEndereco(persistentObject);
	}

	public void deleteEndereco(long id) {
		enderecoService.deleteEndereco(id);
	}
	

	//AvaliacaoFisicoEspecial--------------------------------------------------------------
	@Autowired
	private AvaliacaoFisicoEspecialService  avaliacaoFisicoEspecialService;
		
	public AvaliacaoFisicoEspecial saveAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial newInstance) {
		return avaliacaoFisicoEspecialService.saveAvaliacaoFisicoEspecial(newInstance);
	}

	public AvaliacaoFisicoEspecial updateAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial transientObject) {
		return avaliacaoFisicoEspecialService.updateAvaliacaoFisicoEspecial(transientObject);
	}

	public AvaliacaoFisicoEspecial findAvaliacaoFisicoEspecialById(long id) {
		return avaliacaoFisicoEspecialService.findAvaliacaoFisicoEspecialById(id);
	}

	public List<AvaliacaoFisicoEspecial> getAllAvaliacaoFisicoEspecial() {
		return avaliacaoFisicoEspecialService.getAllAvaliacaoFisicoEspecial();
	}

	public void deleteAvaliacaoFisicoEspecial(AvaliacaoFisicoEspecial persistentObject) {
		avaliacaoFisicoEspecialService.deleteAvaliacaoFisicoEspecial(persistentObject);
	}

	public void deleteAvaliacaoFisicoEspecial(long id) {
		avaliacaoFisicoEspecialService.deleteAvaliacaoFisicoEspecial(id);
	}
	

	//NivelConsciencia--------------------------------------------------------------
	@Autowired
	private NivelConscienciaService  nivelConscienciaService;
		
	public NivelConsciencia saveNivelConsciencia(NivelConsciencia newInstance) {
		return nivelConscienciaService.saveNivelConsciencia(newInstance);
	}

	public NivelConsciencia updateNivelConsciencia(NivelConsciencia transientObject) {
		return nivelConscienciaService.updateNivelConsciencia(transientObject);
	}

	public NivelConsciencia findNivelConscienciaById(long id) {
		return nivelConscienciaService.findNivelConscienciaById(id);
	}

	public List<NivelConsciencia> getAllNivelConsciencia() {
		return nivelConscienciaService.getAllNivelConsciencia();
	}

	public void deleteNivelConsciencia(NivelConsciencia persistentObject) {
		nivelConscienciaService.deleteNivelConsciencia(persistentObject);
	}

	public void deleteNivelConsciencia(long id) {
		nivelConscienciaService.deleteNivelConsciencia(id);
	}
	

	//Estagiario--------------------------------------------------------------
	@Autowired
	private EstagiarioService  estagiarioService;
		
	public Estagiario saveEstagiario(Estagiario newInstance) {
		return estagiarioService.saveEstagiario(newInstance);
	}

	public Estagiario updateEstagiario(Estagiario transientObject) {
		return estagiarioService.updateEstagiario(transientObject);
	}

	public Estagiario findEstagiarioById(long id) {
		return estagiarioService.findEstagiarioById(id);
	}

	public List<Estagiario> getAllEstagiario() {
		return estagiarioService.getAllEstagiario();
	}

	public void deleteEstagiario(Estagiario persistentObject) {
		estagiarioService.deleteEstagiario(persistentObject);
	}

	public void deleteEstagiario(long id) {
		estagiarioService.deleteEstagiario(id);
	}
	

	//TipoPostura--------------------------------------------------------------
	@Autowired
	private TipoPosturaService  tipoPosturaService;
		
	public TipoPostura saveTipoPostura(TipoPostura newInstance) {
		return tipoPosturaService.saveTipoPostura(newInstance);
	}

	public TipoPostura updateTipoPostura(TipoPostura transientObject) {
		return tipoPosturaService.updateTipoPostura(transientObject);
	}

	public TipoPostura findTipoPosturaById(long id) {
		return tipoPosturaService.findTipoPosturaById(id);
	}

	public List<TipoPostura> getAllTipoPostura() {
		return tipoPosturaService.getAllTipoPostura();
	}

	public void deleteTipoPostura(TipoPostura persistentObject) {
		tipoPosturaService.deleteTipoPostura(persistentObject);
	}

	public void deleteTipoPostura(long id) {
		tipoPosturaService.deleteTipoPostura(id);
	}
	

	//Diretor--------------------------------------------------------------
	@Autowired
	private DiretorService  diretorService;
		
	public Diretor saveDiretor(Diretor newInstance) {
		return diretorService.saveDiretor(newInstance);
	}

	public Diretor updateDiretor(Diretor transientObject) {
		return diretorService.updateDiretor(transientObject);
	}

	public Diretor findDiretorById(long id) {
		return diretorService.findDiretorById(id);
	}

	public List<Diretor> getAllDiretor() {
		return diretorService.getAllDiretor();
	}

	public void deleteDiretor(Diretor persistentObject) {
		diretorService.deleteDiretor(persistentObject);
	}

	public void deleteDiretor(long id) {
		diretorService.deleteDiretor(id);
	}
	

	//Animal--------------------------------------------------------------
	@Autowired
	private AnimalService  animalService;
		
	public Animal saveAnimal(Animal newInstance) {
		return animalService.saveAnimal(newInstance);
	}

	public Animal updateAnimal(Animal transientObject) {
		return animalService.updateAnimal(transientObject);
	}

	public Animal findAnimalById(long id) {
		return animalService.findAnimalById(id);
	}

	public List<Animal> getAllAnimal() {
		return animalService.getAllAnimal();
	}

	public void deleteAnimal(Animal persistentObject) {
		animalService.deleteAnimal(persistentObject);
	}

	public void deleteAnimal(long id) {
		animalService.deleteAnimal(id);
	}
	

	//Especie--------------------------------------------------------------
	@Autowired
	private EspecieService  especieService;
		
	public Especie saveEspecie(Especie newInstance) {
		return especieService.saveEspecie(newInstance);
	}

	public Especie updateEspecie(Especie transientObject) {
		return especieService.updateEspecie(transientObject);
	}

	public Especie findEspecieById(long id) {
		return especieService.findEspecieById(id);
	}

	public List<Especie> getAllEspecie() {
		return especieService.getAllEspecie();
	}

	public void deleteEspecie(Especie persistentObject) {
		especieService.deleteEspecie(persistentObject);
	}

	public void deleteEspecie(long id) {
		especieService.deleteEspecie(id);
	}
	

	//TipoTurgorCutaneo--------------------------------------------------------------
	@Autowired
	private TipoTurgorCutaneoService  tipoTurgorCutaneoService;
		
	public TipoTurgorCutaneo saveTipoTurgorCutaneo(TipoTurgorCutaneo newInstance) {
		return tipoTurgorCutaneoService.saveTipoTurgorCutaneo(newInstance);
	}

	public TipoTurgorCutaneo updateTipoTurgorCutaneo(TipoTurgorCutaneo transientObject) {
		return tipoTurgorCutaneoService.updateTipoTurgorCutaneo(transientObject);
	}

	public TipoTurgorCutaneo findTipoTurgorCutaneoById(long id) {
		return tipoTurgorCutaneoService.findTipoTurgorCutaneoById(id);
	}

	public List<TipoTurgorCutaneo> getAllTipoTurgorCutaneo() {
		return tipoTurgorCutaneoService.getAllTipoTurgorCutaneo();
	}

	public void deleteTipoTurgorCutaneo(TipoTurgorCutaneo persistentObject) {
		tipoTurgorCutaneoService.deleteTipoTurgorCutaneo(persistentObject);
	}

	public void deleteTipoTurgorCutaneo(long id) {
		tipoTurgorCutaneoService.deleteTipoTurgorCutaneo(id);
	}
	

	//ScoreCorporal--------------------------------------------------------------
	@Autowired
	private ScoreCorporalService  scoreCorporalService;
		
	public ScoreCorporal saveScoreCorporal(ScoreCorporal newInstance) {
		return scoreCorporalService.saveScoreCorporal(newInstance);
	}

	public ScoreCorporal updateScoreCorporal(ScoreCorporal transientObject) {
		return scoreCorporalService.updateScoreCorporal(transientObject);
	}

	public ScoreCorporal findScoreCorporalById(long id) {
		return scoreCorporalService.findScoreCorporalById(id);
	}

	public List<ScoreCorporal> getAllScoreCorporal() {
		return scoreCorporalService.getAllScoreCorporal();
	}

	public void deleteScoreCorporal(ScoreCorporal persistentObject) {
		scoreCorporalService.deleteScoreCorporal(persistentObject);
	}

	public void deleteScoreCorporal(long id) {
		scoreCorporalService.deleteScoreCorporal(id);
	}
	

}