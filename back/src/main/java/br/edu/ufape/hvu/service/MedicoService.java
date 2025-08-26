package br.edu.ufape.hvu.service;

import java.util.List;
import br.edu.ufape.hvu.exception.ObjectNotFoundException;
import br.edu.ufape.hvu.model.Especialidade;
import br.edu.ufape.hvu.model.Instituicao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.MedicoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.Medico;

@Service
@RequiredArgsConstructor
public class MedicoService implements MedicoServiceInterface {
	private final MedicoRepository repository;

	public Medico saveMedico(Medico newInstance) {
		return repository.save(newInstance);
	}

	public Medico updateMedico(Medico transientObject) {
		return repository.save(transientObject);
	}

	public Medico findMedicoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Medico"));
	}

	public List<Medico> findByInstituicao(Instituicao instituicao){
		List<Medico> medico = repository.findByInstituicaoAndDeletedFalse(instituicao);
		if(medico.isEmpty()){
			throw  new ObjectNotFoundException("Medico");
		}
		return medico;
	}
	
	public List<Medico> findByEspecialidade(Especialidade especialidade){
		List<Medico> medico = repository.findByEspecialidadeAndDeletedFalse(especialidade);
		if(medico.isEmpty()){
			throw  new ObjectNotFoundException("Medico");
		}
		return medico;
	}

    public Medico findByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public List<Medico> findAllMedico() {
        return repository.findByDeletedFalse().stream()
                .filter(medico -> medico.getClass().equals(Medico.class))
                .toList();
    }

    public void deleteMedico(long id){
		Medico obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "Medico"));
		repository.delete(obj);
	}
}