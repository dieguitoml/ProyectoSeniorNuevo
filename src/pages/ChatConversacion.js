import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import perfilEjemplo from "../assets/perfil-generico.png";
import config from "../config";
import "./ChatConversacion.css";
import Header from "../components/Header";

export default function ChatConversacion() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const usuarioId = parseInt(localStorage.getItem("usuario_id"), 10);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [otherUser, setOtherUser] = useState(null);
  const mensajesContainerRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    fetch(`${config.backendUrl}/user/${chatId}`)
      .then((res) => res.json())
      .then((data) => setOtherUser(data))
      .catch((err) => console.error("Error fetching other user:", err));
  }, [chatId]);

  useEffect(() => {
    if (!usuarioId || isNaN(usuarioId)) {
      navigate("/login");
      return;
    }

    const cargarMensajes = () => {
      fetch(`${config.backendUrl}/chats/history/${usuarioId}/${chatId}`)
        .then((res) => res.json())
        .then((data) => {
          setMensajes(Array.isArray(data) ? data : []);
          if (mensajesContainerRef.current) {
            mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
          }
        })
        .catch((err) => console.error("Error cargando mensajes:", err));
    };

    cargarMensajes();
    const interval = setInterval(cargarMensajes, 3000);
    return () => clearInterval(interval);
  }, [chatId, usuarioId, navigate]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    try {
      await fetch(`${config.backendUrl}/chats/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: usuarioId,
          receiver_id: parseInt(chatId, 10),
          body: nuevoMensaje
        }),
      });
      setNuevoMensaje("");
      if (mensajesContainerRef.current) {
        mensajesContainerRef.current.scrollTop = mensajesContainerRef.current.scrollHeight;
      }
    } catch (err) {
      console.error("Error enviando mensaje:", err);
    }
  };

  return (
    <div className="chat-conversation">
      <Header className="new-app-header"  showBack={true} showTitle={false} showLogout={false} otherUser={otherUser} />
      <div className="mensajes-container" ref={mensajesContainerRef}>
        {mensajes.map((mensaje, index) => (
          <div
            key={mensaje.id || index}
            className={`mensaje ${mensaje.sender_id === usuarioId ? "mio" : "otro"}`}
          >
            <div className="mensaje-contenido">
              {mensaje.body}
              <span className="mensaje-timestamp">
                {new Date(mensaje.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={enviarMensaje} className="chat-input-container">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
        />
        <button 
          type="submit"
          className="send-button"
          disabled={!nuevoMensaje.trim()}
        >
          →
        </button>
      </form>
    </div>
  );
}
