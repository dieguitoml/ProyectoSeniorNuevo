import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function LoginSeniorPaso1() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (!email) return;
    // Paso el email al segundo paso
    navigate("/login-senior-paso-2", { state: { email } });
  };

  return (
    <div className="App">
      <Header className="app-header" />
      <main className="form-page">
        <h2>Introduce tu correo</h2>
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

export default LoginSeniorPaso1;
  