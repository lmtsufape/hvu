import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image';
import '../src/components/Footer/Footer';
import Footer from '../src/components/Footer/Footer';
import Link from 'next/link';
import Pagelogin from "./login";
import PageConsultarAnimalTutor from "./consultaranimaltutor";
import {SegundaHeader02} from "../src/components/AnotherHeader/anotherHeader";

export default function Home() {
  
  return (
    <div>
      <Pagelogin />
    </div>
  )
}
