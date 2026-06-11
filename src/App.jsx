import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import heroImg from './assets/hero.png';
import './App.css';


/*COMENTARIO, leelo:
Seguramente y miras esto en clases, ni fe.
Pero lo principal del codigo en logica, tenemos. 
Puse algunos style pero la mayor parte quiero que la hagar vos y luego lo modificamos.
Use varios elementos que use en la API anterior asi que tenemos todas esas bonitas constantes de abajo.
Hay que sacar componentes... todo tuyo.
Y la API es bastante simple asi que no hay muchos productos, solo que si tiene datos. */






/* Diccionario para traducir las categorías que vienen en inglés de la API */
const traductorCategorias = {
  "men's clothing": "Ropa de Hombre",
  "women's clothing": "Ropa de Mujer",
  "electronics": "Electrónica",
  "jewelery": "Joyería"
};

export default function App() {
  const [listaProductos, setListaProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]); 
  const [cargando, setCargando] = useState(true); //Empezamos en true, cambia luego
  const [carrito, setCarrito] = useState([]);
  const [paginas, setProxiPagina] = useState([]); // Guardará la lista de números de páginas
  const [paginaActual, setPaginaActual] = useState(1);
  const productoXPagina = 4;

  //  TRAEMOS LOS DATOS DE LA API 
  useEffect(() => {
    const url = 'https://fakestoreapi.com/products';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        setListaProductos(data); 
        setCargando(false);
      })
      .catch(error => {
        console.error("Error al traer productos:", error);
        setCargando(false); // También apagamos el cargando si hay error
      });
  }, []);

  // FILTRA PRODUCTOS EN BASE A LA BÚSQUEDA (pues lo vimos)
  const productosFiltrados = listaProductos.filter((p) => {
    const termino = busqueda.toLowerCase().trim(); 
    const titulo = p.title ? p.title.toLowerCase() : "";
    const categoria = p.category ? p.category.toLowerCase() : ""; 
    return titulo.includes(termino) || categoria.includes(termino);
  });

  // CALCULA LAS PÁGINAS CUANDO CAMBIE LA BÚSQUEDA (o lista)
  useEffect(() => {
    const totalPaginas = Math.ceil(productosFiltrados.length / productoXPagina); 
    const arregloPaginas = []; 
    
    for (let i = 1; i <= totalPaginas; i++) { 
      arregloPaginas.push(i);
    }
    setProxiPagina(arregloPaginas);
    setPaginaActual(1); // Resetea a la primera página si el usuario busca algo nuevo
  }, [busqueda, listaProductos]); //Dependencias correctas porque me puse a escribir sin mirar lo que habia puesto antes :D

  // LOGICA DE CORTAR EL ARRAY PARA LA PAGINACIÓN (igual de feo a como lo hago yo)
  const indiceUltimoProducto = paginaActual * productoXPagina; 
  const indicePrimerProducto = indiceUltimoProducto - productoXPagina;
  
  // Array final de productos que van a la pantalla
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);

  //CONTROL DE FAVORITOS = API anterior
  const toggleFavorito = (producto) => { 
    const yaEsFavorito = favoritos.some((fav) => fav.id === producto.id); 
    if (yaEsFavorito) {
      setFavoritos(favoritos.filter((fav) => fav.id !== producto.id)); 
    } else {
      setFavoritos([...favoritos, producto]); 
    }
  };

  //AGREGAR ELEMENTOS AL CARRITO
  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.id === producto.id);

    if (existe) {
      setCarrito(carrito.map(item => 
        item.id === producto.id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      ));
    } else {
      setCarrito([...carrito, { 
        id: producto.id, 
        titulo: producto.title, 
        precio: producto.price,
        descripcion: producto.description,
        imagen: producto.image, 
        cantidad: 1 
      }]);
    }
  };

   if (cargando) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Cargando el mercado...</h2>;

  return (
    <div className='Cuerpo-Completo'>
      <h1>Mercado tu pagas</h1>

      {/* INPUT DE BÚSQUEDA (acomodalo en css) */}
      <input 
        type="text" 
        placeholder="Buscar producto o categoría..." 
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}

      />

      <div className='Contenedor'>
        
        {/* SECCIÓN DE PRODUCTOS */}
        <div className='Contenedor-Chiquito'>
          {cargando ? (
            <p>Cargando productos...</p>
          ) : productosPaginados.length === 0 ? (
            <p>No se encontraron productos.</p>
          ) : (
            //Mapeamos productosPaginados
            productosPaginados.map(producto => (
              <div key={producto.id} className='Usar-flex'>
                {/* Botón de Favorito */}
                <button 
                  onClick={() => toggleFavorito(producto)} 
                  style={{ alignSelf: 'flex-end', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                > {/* ASI NO SE VE EL FONDO, ME DA COSA */}
                  {favoritos.some(fav => fav.id === producto.id) ? '★' : '☆'}
                </button>

                <img src={producto.image} alt={producto.title} style={{ width: '100%', height: '120px', objectFit: 'contain' }} />
                
                <span>
                  {traductorCategorias[producto.category] || producto.category}
                </span>

                <h3>{producto.title}</h3>
                <p>${producto.price}</p>
                <p>★ {producto.rating?.rate} ({producto.rating?.count} opiniones)</p>
                <p>{producto.description}</p>
                
                <button onClick={() => agregarAlCarrito(producto)} style={{ marginTop: 'auto', cursor: 'pointer' }}>
                  Agregar al Carrito
                </button>
              </div>
            ))
          )}
        </div>

        {/* SECCIÓN DEL CARRITO VISUAL */}
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

      {/* COMPONENTE DE PAGINACIÓN VISUAL */}
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
  );
}