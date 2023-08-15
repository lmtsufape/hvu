

function LogoHVU() {
    return (
        <img src="/home/rafaela/Documentos/projeto-hvu-front/public/layouts/hvulogo.jpg" alt="Logo do HVU">
            
        </img>
    );
}

function BotaoCadastro() {
    return (
        <button>
            Cadastre-se
        </button>
    );
}

function BotaoLogin() {
    return (
        <button>
            Login
        </button>
    );
}

export default function Header() {
    return (
        <div>
            <p>
                <LogoHVU />
                <BotaoCadastro />
                <BotaoLogin />
            </p>
        </div>
    );    
  }
