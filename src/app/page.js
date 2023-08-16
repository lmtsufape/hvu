import Image from 'next/image'
import './Footer'
import Footer from './Footer'
import Header from './header'
import LoginPage from './login_page';
import {Text} from './texto_login_page';

export default function Home() {
  return (
    <div>
      <Header />
      <Text />
      <Footer/>
    </div>
  )
}
