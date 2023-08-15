

function LogoHVU() {
    return (
        <img src="./public/layouts/hvulogo.png">
            
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
