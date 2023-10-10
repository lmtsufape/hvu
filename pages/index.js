import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image';
import '../src/components/Footer/Footer';
import Footer from '../src/components/Footer/Footer';
import Link from 'next/link';
import Pagelogin from "./login";
import PageConsultarAnimalTutor from "./consultar_animal_tutor";
import {SegundaHeader02} from "../src/components/AnotherHeader/anotherHeader";
import CampoPesquisa from "../src/components/CampoPesquisa/campo_pesquisa";

export default function Home() {
  
  return (
    <div>
      <CampoPesquisa />
    </div>
  )
}
