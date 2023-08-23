import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import './components/Footer'
import Footer from './components/Footer'
import Header from './header'
import {LoginFormulario} from './login_forms';
import { CampoPesquisa } from "./campo_pesquisa";
import Link from 'next/link';
import Pagecadastrotutor from "../../pages/cadastrotutor";


export default function Home() {
  return (
    <div>
      <Header />
      <CampoPesquisa />
      <Footer/>
      <Pagecadastrotutor/>
    </div>
  )
}
