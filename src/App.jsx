import React, { createContext } from 'react';
import './App.css';
import { useProductos } from './hooks/fetchData';
import { useCarrito } from './hooks/carrito';
import { useTema } from './hooks/useTema';
import Productos from './componentes/productos';

import 'bootstrap-icons/font/bootstrap-icons.css';

const traductorCategorias = {
  "men's clothing": "Ropa de Hombre",
  "women's clothing": "Ropa de Mujer",
  "electronics": "Electrónica",
  "jewelery": "Joyería"
};

const TemaContext = createContext();



export default function App() {

  const { temaOscuro, toggleTema } = useTema();

  const {
    listaProductos,
    cargando,
    paginas,
    busqueda,
    setBusqueda,
    paginaActual,
    setPaginaActual,
    favoritos,
    toggleFavorito
  } = useProductos();

  const { agregarAlCarrito, existe, carrito } = useCarrito();

  if (cargando) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Cargando el mercado...</h2>;

  return (

    <div className={`Cuerpo-Completo ${temaOscuro ? 'tema-oscuro' : 'tema-claro'}`}>

      <button onClick={toggleTema}>
        <i className={`bi ${temaOscuro ? 'bi-sun-fill' : 'bi-moon-stars-fill'}`}></i>
        {temaOscuro ? ' Modo claro' : ' Modo oscuro'}
      </button>
      <div className='Cuerpo-Completo'>
        <h1>Mercado tu pagas</h1>

        <input
          type="text"
          placeholder="Buscar producto o categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className='Contenedor'>
          <main>
            {listaProductos.map(producto => (
              <Productos
                producto={producto}
                key={producto.id}
                agregarAlCarrito={agregarAlCarrito}
                existe={existe}
                esFavorito={favoritos.some(fav => fav.id === producto.id)}
                toggleFavorito={toggleFavorito}
              />
            ))}
          </main>

          {/* FAVORITOS */}
          <div className='Otro-Contenedor-Chiquito'>
            <h2>Favoritos ({favoritos.length})</h2>
            {favoritos.length === 0 ? (
              <p>No tenés favoritos aún.</p>
            ) : (
              favoritos.map(fav => (
                <div key={fav.id}>
                  <h4>{fav.title}</h4>
                  <button onClick={() => toggleFavorito(fav)}>Quitar</button>
                </div>
              ))
            )}
          </div>

          {/* CARRITO */}
          <div className='Otro-Contenedor-Chiquito'>
            <h2>Tu Carrito ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})</h2>
            {carrito.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              <div>
                {carrito.map(item => (
                  <div key={item.id}>
                    <h4>{item.titulo}</h4>
                    <p>Cantidad: {item.cantidad} x ${item.precio}</p>
                    <p>Subtotal: ${(item.cantidad * item.precio).toFixed(2)}</p>
                  </div>
                ))}
                <h3>Total: ${carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0).toFixed(2)}</h3>
              </div>
            )}
          </div>
        </div>

        {paginas.length > 1 && (
          <div className="paginacion" style={{ marginTop: '20px', display: 'flex', gap: '5px', justifyContent: 'center' }}>
            {paginas.map(num => (
              <button
                key={num}
                onClick={() => setPaginaActual(num)}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  backgroundColor: paginaActual === num ? '#20578f' : '#fff',
                  color: paginaActual === num ? '#fff' : '#000',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}