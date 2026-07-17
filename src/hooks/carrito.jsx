import { useState } from "react";

export function useCarrito() {

    const [carrito, setCarrito] = useState([]);

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
          const eliminarDelCarrito = (id) => {

    const producto = carrito.find(item => item.id === id);

    if (!producto) return;

    if (producto.cantidad > 1) {
        setCarrito(
            carrito.map(item =>
                item.id === id
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    } else {
        setCarrito(
            carrito.filter(item => item.id !== id)
        );
    }
};

    const existe = (producto) => carrito.some(item => item.id === producto.id);

    return {
        carrito,
        setCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        existe        // <= función que devuelve true/false
    };
}