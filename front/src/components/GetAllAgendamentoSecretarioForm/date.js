import React, { useState, useEffect } from 'react';
import styles from "./date.module.css";

// Função que retorna a data no formato: 28 Julho, 2023
export function DataCompleta(data) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(data).toLocaleDateString('pt-BR', options);
}

// Função que retorna a data no formato: 28/07
export function DataCurta(data) {
  const options = { day: 'numeric', month: 'numeric' };
  return new Date(data).toLocaleDateString('pt-BR', options).replace(/\//g, '/');
}

// Função que retorna o dia da semana (ex: sexta)
export function DiaDaSemana(data) {
  const options = { weekday: 'long' };
  return new Date(data).toLocaleDateString('pt-BR', options).toLowerCase();
}
