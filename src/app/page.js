import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import './components/Footer'
import Footer from './components/Footer'
import Link from 'next/link';
import Pagecadastrotutor from "../../pages/cadastrotutor";
import Pagelogin from "../../pages/login"
import Text from "./texto_login_page";

export default function Home() {
  return (
    <div>
      <Pagecadastrotutor />
    </div>
  )
}
