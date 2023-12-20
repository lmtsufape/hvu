import React from 'react';
import { Header03 } from "../../src/components/Header";
import { SegundaHeader01 } from "../../src/components/AnotherHeader/anotherHeader";
import Footer from "../../src/components/Footer";

function TemplateTutor({ children }) {
  return (
    <>
      <header>
        < Header03 />
        < SegundaHeader01 />
      </header>

      <main>
        {children}
      </main>

      <footer> < Footer /> </footer>
    </>
  );
}

export default TemplateTutor
