package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.ExameMicroscopico;

public interface ExameMicroscopicoServiceInterface {
	ExameMicroscopico saveExameMicroscopico(ExameMicroscopico o);
	ExameMicroscopico findExameMicroscopicoById(long id);
	ExameMicroscopico updateExameMicroscopico(ExameMicroscopico u);
	void deleteExameMicroscopico(ExameMicroscopico u);
	void deleteExameMicroscopico(long id);
	List<ExameMicroscopico> getAllExameMicroscopico();
    
    

    
}