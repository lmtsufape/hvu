package br.edu.ufape.hvu.model.enums;

public enum TipoServico {
    NECROPSIA("N"),
    MICROSCOPIA("G"),
    NECROPSIA_COM_MICROSCOPIA("GN");

    private String codigo;

    TipoServico(String codigo) {
        this.codigo = codigo;
    }

    public String getCodigo() {
        return this.codigo;
    }
}
