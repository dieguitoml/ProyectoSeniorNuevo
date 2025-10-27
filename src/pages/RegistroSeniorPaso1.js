import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function RegistroSeniorPaso1() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!nombre || !email) return;
    navigate("/registro-senior-paso-2", { state: { nombre, email } });
  };

  return (
    <div className="App">
      <Header className="app-header" />
      <main className="form-page">
        <h2>Registro - Paso 1</h2>
        <input
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" onClick={handleNext}>
          Siguiente
        </button>
      </main>
    </div>
  );
}

export default RegistroSeniorPaso1;
