package br.edu.ufape.hvu.controller.dto.request;

import br.edu.ufape.hvu.model.Especie;
import br.edu.ufape.hvu.model.Area;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor 
public class AreaRequest {
    private long id;
	private String tituloArea;
	private EspecieRequest especie;

	public Area convertToEntity() {
		Area area = new Area();

		area.setId(this.id);
		area.setTituloArea(this.tituloArea);

		if (this.especie != null) {
			Especie especieEntity = new Especie();
			especieEntity.setId(this.especie.getId());
			area.setEspecie(especieEntity);
		}

		return area;
	}
}
