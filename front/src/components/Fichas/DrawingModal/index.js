'use client'

import dynamic from 'next/dynamic';
import styles from './index.module.css';

const KonvaCanvas = dynamic(() => import('../KonvaCanvas'), {
  ssr: false,
  loading: () => <p>Carregando editor de desenho...</p>
});


const DrawingModal = ({ show, onHide, backgroundImage, onSave, showDrawingModal, dimensoesImagem }) => {
  return (
    show && (
      <div className={styles.modal_overlay}>
        <div className={styles.modal_content}>
          <button className={styles.close_button} onClick={onHide}>x</button>
          <KonvaCanvas 
            backgroundImage={backgroundImage}
            onSave={onSave}
            showDrawingModal={showDrawingModal}
            dimensoesImagem={dimensoesImagem}
          />
        </div>
      </div>
    )
  );
};

export default DrawingModal;