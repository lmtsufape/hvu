import "bootstrap/dist/css/bootstrap.min.css";
import Image from 'next/image'
import './Footer'
import Footer from './Footer'
import Header from './header'
import {LoginFormulario} from './login_forms';

export default function Home() {
  return (
    <div>
      <Header />
      <LoginFormulario />
      <Footer/>
    </div>
  )
}
