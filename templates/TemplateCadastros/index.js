import React from 'react';
import { Header04 } from "../../src/components/Header/header";
import Footer from "../../src/components/Footer/Footer";

function TemplateCadastros({ children }) {
  return (
    <>
      <header>
        < Header04 />
      </header>

      <main>
        {children}
      </main>

      <footer> < Footer /> </footer>
    </>
  );
}

export default TemplateCadastros
