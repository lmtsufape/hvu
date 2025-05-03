'use client';

import { Stage, Layer, Line, Image as KonvaImage } from 'react-konva';
import { useRef, useState, useEffect } from 'react';
import useImage from 'use-image';
import styles from './index.module.css';
import Alert from "../../Alert";

const KonvaCanvas = ({ backgroundImage, onSave, showDrawingModal, dimensoesImagem }) => {
  const stageRef = useRef(null);
  const [linhasDesenhadas, setlinhasDesenhadas] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [loadedImage] = useImage(backgroundImage, 'anonymous');
  const [tool, setTool] = useState('pen'); 
  const [penBrushSize, setPenBrushSize] = useState(5);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showDrawingModal) {
      loadCanvas();
    }
  }, [showDrawingModal]);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();
    setlinhasDesenhadas([...linhasDesenhadas, {
      tool,
      points: [pos.x, pos.y],
      color: brushColor,
      size: brushSize
    }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    const lastLine = linhasDesenhadas[linhasDesenhadas.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    const newlinhasDesenhadas = linhasDesenhadas.slice(0, linhasDesenhadas.length - 1).concat(lastLine);
    setlinhasDesenhadas(newlinhasDesenhadas);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  //salva a imagem com as linhas desenhadas
  // e as linhas desenhadas em formato de array
  const handleSave = () => {
    const imagemFinal = stageRef.current.toDataURL();
    localStorage.setItem('canvasKonva', JSON.stringify(linhasDesenhadas));
    onSave(imagemFinal, linhasDesenhadas);
    setShowAlert(true);
  };

  const loadCanvas = () => {
    const saved = localStorage.getItem('canvasKonva');
    if (saved) {
      setlinhasDesenhadas(JSON.parse(saved));
    }
  };

  const clearCanvas = () => {
    setlinhasDesenhadas([]);
  };

  const toggleTool = () => {
    setTool(prevTool => {
      if (prevTool === 'pen') {
        // Salva o tamanho da caneta e muda para borracha
        setPenBrushSize(brushSize);
        setBrushSize(13); // Tamanho fixo da borracha
        return 'eraser';
      } else {
        // Restaura o tamanho da caneta ao voltar da borracha
        setBrushSize(penBrushSize);
        return 'pen';
      }
    });
  };

  const closeModal = () => {
    setShowAlert(false);
  };

  return (
    <div className={styles.fabric_editor}>
      <div className={styles.canvas_container}>
        <Stage
          ref={stageRef}
          width={dimensoesImagem.largura}
          height={dimensoesImagem.altura}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          style={{
            backgroundColor: '#fff',
            touchAction: 'none',
            cursor: tool === 'eraser' ? 'url(/icon_borracha.png) 13 12, auto' : 'crosshair'

          }}
        >
          <Layer>
            {loadedImage && (
              <KonvaImage image={loadedImage} width={dimensoesImagem.largura} height={dimensoesImagem.altura} />
            )}
          </Layer>

          <Layer>
            {linhasDesenhadas.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === 'eraser' ? 'white' : line.color}
                strokeWidth={line.size}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.brush_controls}>
          <label>
            Cor:
            <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} className={styles.colorInput}/>
          </label>
          <label>
            Tamanho:
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className={styles.rangeInput}
              disabled={tool === 'eraser'}
            />
            {brushSize}
          </label>
        </div>

        <div className={styles.actions}>
          <div className={styles.buttons_box}>
            <button type="button" onClick={clearCanvas} className={styles.btn_clear}>
              Limpar
            </button>
            <button
              type="button"
              onClick={toggleTool}
              className={styles.btn_toggle}
            >
              {tool === 'eraser' ? 'Borracha': 'Caneta'}
            </button>
          </div>
          <div className={styles.buttons_box}>
            <button type="button" onClick={handleSave} className={styles.btn_save}>
              Salvar
            </button>
          </div>
        </div>
      </div>
      {<Alert message="Salvo com sucesso!" show={showAlert} onClose={closeModal}/>}
    </div>
  );
};

export default KonvaCanvas;
