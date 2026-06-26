import React, { useState } from "react";
import { TemaContext } from "./TemaContext";

export function TemaProvider({ children }) {
    const [temaOscuro, setTemaOscuro] = useState(false);
    const toggleTema = () => setTemaOscuro(prev => !prev);

    return (
        <TemaContext.Provider value={{ temaOscuro, toggleTema }}>
            {children}
        </TemaContext.Provider>
    );
}