import { useState, useEffect } from "react";

export function useProductos() {

    const [listaProductos, setListaProductos] = useState([]);
    const [favoritos, setFavoritos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [paginas, setPaginas] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const productoXPagina = 4;

    useEffect(() => {
        fetch('https://fakestoreapi.com/products')
            .then(response => response.json())
            .then(data => {
                setListaProductos(data);
                setCargando(false);
            })
            .catch(error => {
                console.error("Error al traer productos:", error);
                setCargando(false);
            });
    }, []);

    const productosFiltrados = listaProductos.filter((p) => {
        const termino = busqueda.toLowerCase().trim();
        const titulo = p.title ? p.title.toLowerCase() : "";
        const categoria = p.category ? p.category.toLowerCase() : "";
        return titulo.includes(termino) || categoria.includes(termino);
    });

    useEffect(() => {
        const totalPaginas = Math.ceil(productosFiltrados.length / productoXPagina);
        const arregloPaginas = [];
        for (let i = 1; i <= totalPaginas; i++) {
            arregloPaginas.push(i);
        }
        setPaginas(arregloPaginas);
        setPaginaActual(1);
    }, [busqueda, listaProductos]);

    const indiceUltimo = paginaActual * productoXPagina;
    const indicePrimero = indiceUltimo - productoXPagina;
    const productosPaginados = productosFiltrados.slice(indicePrimero, indiceUltimo);

    const toggleFavorito = (producto) => {
        const yaEsFavorito = favoritos.some(fav => fav.id === producto.id);
        if (yaEsFavorito) {
            setFavoritos(favoritos.filter(fav => fav.id !== producto.id));
        } else {
            setFavoritos([...favoritos, producto]);
        }
    };

    return {
        listaProductos: productosPaginados, // ← nombre unificado con App.jsx
        cargando,
        paginas,
        busqueda,
        setBusqueda,
        paginaActual,
        setPaginaActual,
        productoXPagina,
        favoritos,
        toggleFavorito
    };
}