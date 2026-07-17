import axios from "axios"  //si pregunta, Axios es lo conecta el frontend con el backend como si fuera un fetch en el backend


export default function useBackendAPI() {

    const sendToBackend = async (carrito, user) => {
       const parseCart = carrito.map(producto => ({
    title: producto.titulo,
    quantity: producto.cantidad,
    unit_price: Number(producto.precio)  // aca se pide a carrito los datos del producto titulo precio cantidad y los envia al backend a la funcion post_carrito
}));
        try {
            console.log("Enviando al backend...");

            const res = await axios.post("http://localhost:8000/carrito", {
                items: parseCart,
                user: user
            });

            // 2. Imprimimos exactamente qué nos devolvió Axios
            console.log("Respuesta completa de Axios:", res);

            // 3. Verificamos la ruta de los datos
            const urlPago =  res.data.sandbox_init_point;           
            console.log("URL de redirección:", urlPago);

            // 4. Solo redirigimos si la URL existe de verdad
            if (urlPago) {
                window.location.href = urlPago;                               
            } else {
                console.error("Atención: El backend no devolvió el sandbox_init_point", res.data);              //me explico, aca te redirige al mercado pago, donde pasamos los datos de la cuenta de comprador de prueba, y Nos deja pagar
             }

        } catch (error) {
            console.error("Error en la petición:", error);
        }
    }

    return {
        sendToBackend
    }

}