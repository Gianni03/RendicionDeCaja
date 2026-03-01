# 🧾 Rendición de Caja — App Web

Aplicación web moderna y minimalista diseñada para la **rendición de caja diaria acumulada** (hasta 6 días). Optimizada para uso en dispositivos móviles, permite llevar un control preciso de facturación, cobros por POSNET, conteo de billetes físicos y detección de diferencias.

![Rendición de Caja Demo](/home/gianni/.gemini/antigravity/brain/57918c46-4175-4018-8971-aa3f711cb0dc/rendicion_smoke_test_1772397806739.webp)

## ✨ Características

- **📅 Registro por Día**: Carga hasta 6 días de rendición con cálculo automático de efectivo esperado (`Facturado - POSNET`).
- **💵 Contador de Billetes**: Interfaz táctil optimizada para contar billetes por denominación (ordenados de mayor a menor).
- **⚖️ Comparación Inteligente**: Indicador visual (verde/rojo/amarillo) que muestra si la caja cuadra, sobra o falta dinero.
- **📱 Mobile First**: Diseño 100% responsivo con touch targets de ≥48px, campos con teclados numéricos automáticos y soporte para safe-areas (notches).
- **💾 Persistencia Local**: Los datos se guardan automáticamente en el navegador (`LocalStorage`), permitiendo cerrar la app y continuar después.
- **📄 Exportación a PDF**: Generación de informes profesionales en blanco y negro (A4) listos para imprimir o compartir por WhatsApp.

## 🛠️ Stack Tecnológico

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estado Global**: [Zustand](https://github.com/pmndrs/zustand)
- **PDF**: [jsPDF](https://github.com/parallax/jsPDF) + [autoTable](https://github.com/simonbengtsson/jspdf-autotable)
- **Estilos**: Vanilla CSS Modules (diseño limpio y premium)
- **Utilidades**: `uuid` para manejo de registros únicos.

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio**:

   ```bash
   git clone <URL_DEL_REPO>
   cd rendiiónV1
   ```

2. **Instalar dependencias**:

   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`.

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📋 Requisitos para el PDF

El PDF generado está diseñado para ser:

- **Formato**: A4 Vertical.
- **Color**: Blanco y Negro (ahorro de tinta).
- **Secciones**: Resumen diario, Totales acumulados, Desglose de billetes y Resultado final de comparación.

## 🤝 Contribuciones

Este es un proyecto cerrado desarrollado para cubrir necesidades específicas de rendición de caja. No obstante, siéntete libre de clonarlo y adaptarlo a tus necesidades.

---

Generado con ❤️ para una gestión de caja más eficiente.
