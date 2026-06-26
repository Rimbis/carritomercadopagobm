import React from "react";

const traductorCategorias = {
  "men's clothing": "Ropa de Hombre",
  "women's clothing": "Ropa de Mujer",
  "electronics": "Electrónica",
  "jewelery": "Joyería"
};

function Productos({ producto, agregarAlCarrito, existe, esFavorito, toggleFavorito }) {

    return (
        <div className='Usar-flex'>

            {/* Botón de Favorito */}
            <button
                onClick={() => toggleFavorito(producto)}
                style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
                {esFavorito ? '★' : '☆'}
            </button>

            <img
                src={producto.image}
                alt={producto.title}
                style={{ width: '100%', height: '120px', objectFit: 'contain' }}
            />

            <span>
                {traductorCategorias[producto.category] || producto.category}
            </span>

            <h3>{producto.title}</h3>
            <p>${producto.price}</p>
            <p>★ {producto.rating?.rate} ({producto.rating?.count} opiniones)</p>
            <p>{producto.description}</p>

            <button
                onClick={() => agregarAlCarrito(producto)}
                style={{ marginTop: 'auto', cursor: 'pointer' }}
            >
                {existe(producto) ? 'Ya en el carrito' : 'Agregar al Carrito'}
            </button>

        </div>
    );
}

export default Productos;