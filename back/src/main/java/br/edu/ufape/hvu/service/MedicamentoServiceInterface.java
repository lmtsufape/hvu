package br.edu.ufape.hvu.service;

import java.util.List;

import br.edu.ufape.hvu.model.Medicamento;

public interface MedicamentoServiceInterface {
	Medicamento saveMedicamento(Medicamento o);
	Medicamento findMedicamentoById(long id);
	Medicamento updateMedicamento(Medicamento u);
	void deleteMedicamento(Medicamento u);
	void deleteMedicamento(long id);
	List<Medicamento> getAllMedicamento();
    
    

    
}