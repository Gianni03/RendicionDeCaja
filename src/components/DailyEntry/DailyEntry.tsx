import React, { useState } from 'react';
import { useRendicionStore } from '../../store/useRendicionStore';
import { formatCurrency, getTodayISO } from '../../utils/calculations';
import styles from './DailyEntry.module.css';

const MAX_DAYS = 6;

export function DailyEntry() {
  const days = useRendicionStore((s) => s.days);
  const addDay = useRendicionStore((s) => s.addDay);

  const [date, setDate] = useState(getTodayISO());
  const [totalFacturado, setTotalFacturado] = useState('');
  const [posnet, setPosnet] = useState('');
  const [gastos, setGastos] = useState('');
  const [descripcionGasto, setDescripcionGasto] = useState('');
  const [error, setError] = useState<string | null>(null);

  const facturadoNum = parseFloat(totalFacturado) || 0;
  const posnetNum = parseFloat(posnet) || 0;
  const gastosNum = parseFloat(gastos) || 0;
  const previewEfectivo = facturadoNum - posnetNum - gastosNum;

  const canAdd = days.length < MAX_DAYS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError('Seleccioná una fecha.');
      return;
    }
    if (facturadoNum <= 0) {
      setError('El total facturado debe ser mayor a 0.');
      return;
    }
    if (posnetNum < 0) {
      setError('El total POSNET no puede ser negativo.');
      return;
    }
    if (gastosNum < 0) {
      setError('Los gastos no pueden ser negativos.');
      return;
    }

    const err = addDay(date, facturadoNum, posnetNum, gastosNum, descripcionGasto);
    if (err) {
      setError(err);
      return;
    }

    // Reset form
    setDate(getTodayISO());
    setTotalFacturado('');
    setPosnet('');
    setGastos('');
    setDescripcionGasto('');
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Carga de Día</h2>
        <span className={styles.badge}>
          {days.length}/{MAX_DAYS} días
        </span>
      </div>

      {!canAdd && (
        <div className={styles.limitWarning}>
          Se alcanzó el máximo de {MAX_DAYS} días.
        </div>
      )}

      {canAdd && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="entry-date" className={styles.label}>
                Fecha
              </label>
              <input
                id="entry-date"
                type="date"
                className={styles.input}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={getTodayISO()}
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="entry-facturado" className={styles.label}>
                Total Facturado
              </label>
              <input
                id="entry-facturado"
                type="number"
                inputMode="decimal"
                className={styles.input}
                value={totalFacturado}
                onChange={(e) => setTotalFacturado(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="entry-posnet" className={styles.label}>
                Total POSNET
              </label>
              <input
                id="entry-posnet"
                type="number"
                inputMode="decimal"
                className={styles.input}
                value={posnet}
                onChange={(e) => setPosnet(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="entry-gastos" className={styles.label}>
                Gastos (opcional)
              </label>
              <input
                id="entry-gastos"
                type="number"
                inputMode="decimal"
                className={styles.input}
                value={gastos}
                onChange={(e) => setGastos(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="entry-descripcion-gasto" className={styles.label}>
                Descripción (opcional)
              </label>
              <input
                id="entry-descripcion-gasto"
                type="text"
                className={styles.input}
                value={descripcionGasto}
                onChange={(e) => setDescripcionGasto(e.target.value)}
                placeholder="Detalle del gasto"
                maxLength={50}
              />
            </div>
          </div>

          {(facturadoNum > 0 || posnetNum > 0 || gastosNum > 0) && (
            <div className={styles.preview}>
              <span className={styles.previewLabel}>Efectivo del día:</span>
              <span
                className={`${styles.previewValue} ${
                  previewEfectivo < 0 ? styles.previewNegative : ''
                }`}
              >
                {formatCurrency(previewEfectivo)}
              </span>
            </div>
          )}

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className={styles.button} disabled={!canAdd}>
            + Agregar Día
          </button>
        </form>
      )}
    </section>
  );
}
