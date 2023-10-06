import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image';
import './components/footer/Footer';
import Footer from './components/footer/Footer';
import Link from 'next/link';
import Pagelogin from "../../pages/login";
import PageConsultarAnimalTutor from "../../pages/consultar_animal_tutor";
import {SegundaHeader02} from "./components/anotherheader/another_header";

export default function Home() {

  
  return (
    <div>
      <Pagelogin />
    </div>
  )
}
