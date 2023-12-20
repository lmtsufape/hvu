import React from 'react';
import { Header04 } from "../../src/components/Header";
import Footer from "../../src/components/Footer";

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
