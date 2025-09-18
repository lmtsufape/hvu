    package br.edu.ufape.hvu.model.enums;

    import lombok.AllArgsConstructor;
    import lombok.Getter;

    @Getter
    @AllArgsConstructor
    public enum TipoServico {
        NECROPSIA("N"),
        MICROSCOPIA("G"),
        NECROPSIA_COM_MICROSCOPIA("GN");

        private final String codigo;
    }
