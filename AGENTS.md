# 🧾 App de Rendición de Caja

Aplicación web para la rendición acumulada de caja (hasta 6 días), con cálculo automático de efectivo esperado, contador de billetes y generación de PDF imprimible en blanco y negro.

---

## 🎯 Objetivo

Permitir al usuario:

1. Cargar rendiciones por día (hasta 6 días acumulados).
2. Calcular automáticamente el efectivo esperado:
   
   efectivo = total_facturado - total_posnet

3. Acumular el efectivo total esperado.
4. Contar billetes manualmente.
5. Comparar efectivo esperado vs efectivo real.
6. Generar y descargar un PDF en formato imprimible.

---

## 📆 Módulo 1: Rendición por Día

### Requisitos

- Selección de fecha.
- Input:
  - Total facturado (ticket 1)
  - Total cobrado por POSNET (ticket 2)
- Cálculo automático:
  
  subtotal_efectivo_dia = total_facturado - posnet

- Mostrar resumen por día:
  
  Fecha | Total | POSNET | Subtotal Efectivo

- Permitir hasta 6 días acumulados.
- Mostrar:
  - Total acumulado POSNET
  - Total acumulado efectivo esperado

---

## 💾 Persistencia

- Persistencia local (LocalStorage o IndexedDB).
- Debe permitir:
  - Cargar días en distintos momentos.
  - Mantener datos tras cerrar navegador.
  - Botón para limpiar rendición completa.

---

## 💵 Módulo 2: Contador de Billetes

Billetes disponibles:

- 100
- 200
- 500
- 1000
- 2000
- 10000
- 20000

### Funcionamiento

Para cada billete:
- Input de cantidad.
- Cálculo automático del subtotal por denominación.

Debe mostrar:
- Total efectivo contado.

---

## ⚖️ Comparación Automática

Comparar:

efectivo esperado vs efectivo contado

### Estados visuales

- 🟢 Verde → Coincide exacto.
- 🔴 Rojo → Faltante.
- 🟡 Amarillo → Sobrante.

Debe mostrar diferencia numérica:
  
Diferencia = contado - esperado

---

## 📄 Generación de PDF

Botón:

- Descargar PDF
- Compartir (compatible con WhatsApp)

### Formato del PDF (blanco y negro)

Secciones:

1. Rendición por día:

Fecha  
Total  
POSNET  
Subtotal efectivo  

2. Totales:

Total POSNET  
Total efectivo esperado  

3. Contador de billetes:

Denominación | Cantidad | Subtotal  

Total efectivo contado  
Diferencia  

Formato limpio, alineado para impresión en A4 vertical.

---

## 🛠️ Stack Sugerido

- React + Vite
- Zustand o Context API para estado global
- LocalStorage para persistencia
- jsPDF o pdf-lib para generación de PDF
- CSS simple enfocado en claridad

---

## 🚀 Criterios de Aceptación

- No permite más de 6 días.
- Todos los cálculos son automáticos.
- Persistencia funciona correctamente.
- Indicador visual de diferencia es claro.
- PDF se genera correctamente y es legible en impresión.

