package br.edu.ufape.hvu.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import br.edu.ufape.hvu.repository.ExameMicroscopicoRepository;
import br.edu.ufape.hvu.exception.IdNotFoundException;
import br.edu.ufape.hvu.model.ExameMicroscopico;

@Service
public class ExameMicroscopicoService implements ExameMicroscopicoServiceInterface {
	@Autowired
	private ExameMicroscopicoRepository repository;


	public ExameMicroscopico saveExameMicroscopico(ExameMicroscopico newInstance) {
		return repository.save(newInstance);
	}

	public ExameMicroscopico updateExameMicroscopico(ExameMicroscopico transientObject) {
		return repository.save(transientObject);
	}

	public ExameMicroscopico findExameMicroscopicoById(long id) {
		return repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "ExameMicroscopio"));
	}

	public List<ExameMicroscopico> getAllExameMicroscopico(){
		return repository.findAll();
	}

	public void deleteExameMicroscopico(ExameMicroscopico persistentObject){
		this.deleteExameMicroscopico(persistentObject.getId());
		
	}
	
	public void deleteExameMicroscopico(long id){
		ExameMicroscopico obj = repository.findById(id).orElseThrow( () -> new IdNotFoundException(id, "ExameMicroscopio"));
		repository.delete(obj);
	}	
	
	
	
}