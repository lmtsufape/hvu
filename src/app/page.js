import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import './Footer'
import Footer from './Footer'
import Header from './header'
import {LoginFormulario} from './login_forms';
import { CampoPesquisa } from "./campo_pesquisa";
import Link from 'next/link';
import Pagecadastrotutor from "./cadastrotutor";


export default function Home() {
  return (
    <div>
      <Header />
      <CampoPesquisa />
      <Footer/>
    </div>
  )
}
