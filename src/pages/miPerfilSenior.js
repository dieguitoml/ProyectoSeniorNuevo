import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import config from "../config";
import "./miPerfilSenior.css";

function MiPerfilSenior() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [multimedia, setMultimedia] = useState([]);
  const [activeTab, setActiveTab] = useState("descripcion");
  const [valoracion] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [etiquetas, setEtiquetas] = useState([]);
  const [nuevaEtiqueta, setNuevaEtiqueta] = useState("");
  const [sortBy, setSortBy] = useState("reciente");
  const [resenas, setResenas] = useState([
    {
      id: 1,
      autor: "Teresa Torres",
      foto: "https://via.placeholder.com/40",
      valoracion: 5,
      fecha: "Hace 4 semanas",
      numFotos: 2,
      numResenas: 7,
      texto: "Espectacular centro de entrenamimiento y pista de competición..... ideal las calles interiores para hacer series de velocidad, las calles del anillo en súper buen estado para acelerar y sentir la velocidad en las piernas. También destacable la...",
    },
    {
      id: 2,
      autor: "Juan García",
      foto: "https://via.placeholder.com/40",
      valoracion: 4,
      fecha: "Hace 2 semanas",
      numFotos: 1,
      numResenas: 3,
      texto: "Muy buen servicio y atención al cliente. Recomendaría este lugar para todos. La experiencia fue excelente y volvería sin dudarlo.",
    },
    {
      id: 3,
      autor: "María López",
      foto: "https://via.placeholder.com/40",
      valoracion: 5,
      fecha: "Hace 1 semana",
      numFotos: 3,
      numResenas: 5,
      texto: "Increíble experiencia. El personal fue muy amable y profesional. Las instalaciones están en perfectas condiciones. Definitivamente volvería.",
    },
  ]);

  const fileInputRef = useRef(null);
  const multimediaInputRef = useRef(null);

  // Cargar perfil
  useEffect(() => {
    const fetchPerfil = async () => {
      const usuario_id = localStorage.getItem("usuario_id");
      if (!usuario_id) return navigate("/login");
      const res = await fetch(`${config.backendUrl}/perfil/${usuario_id}`);
      if (res.ok) {
        const data = await res.json();
        setNombre(data.nombre_usuario || "");
        setDescripcion(data.descripcion || "");
        setProfileImage(data.foto_perfil || null);
        setMultimedia(data.multimedia || []);
        setEtiquetas(data.etiquetas || []);
      }
    };
    fetchPerfil();
  }, [navigate]);

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleMultimediaChange = (event) => {
    const files = Array.from(event.target.files);
    const newMultimedia = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type,
      titulo: "Nuevo Anuncio",
      descripcion: "Descripción del anuncio",
      precio: 0,
    }));
    setMultimedia((prev) => [...prev, ...newMultimedia]);
  };

  const renderStars = () => {
    const total = 5;
    return Array.from({ length: total }).map((_, i) => (
      <span key={i} className={i < valoracion ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  const renderReviewStars = (rating) => {
    const total = 5;
    return Array.from({ length: total }).map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  const agregarEtiqueta = () => {
    if (nuevaEtiqueta.trim()) {
      setEtiquetas([...etiquetas, nuevaEtiqueta]);
      setNuevaEtiqueta("");
    }
  };

  const eliminarEtiqueta = (index) => {
    setEtiquetas(etiquetas.filter((_, i) => i !== index));
  };

  const multimediaOrdenada = [...multimedia].sort((a, b) => {
    if (sortBy === "reciente") return 0;
    if (sortBy === "precio-asc") return (a.precio || 0) - (b.precio || 0);
    if (sortBy === "precio-desc") return (b.precio || 0) - (a.precio || 0);
    return 0;
  });

  const totalResenas = resenas.length;
  const promedioValoracion = (
    resenas.reduce((sum, r) => sum + r.valoracion, 0) / totalResenas
  ).toFixed(1);

  return (
    <div className="perfil-page">
      <div className="header-global">
        <Header title="Mi Perfil" />
        <div className="perfil-header-fixed">
          <div className={`perfil-foto ${isEditing ? "editable" : ""}`} onClick={handleImageClick}>
            {profileImage ? (
              <img src={profileImage} alt="Perfil" />
            ) : (
              <div className="perfil-placeholder"></div>
            )}
            {isEditing && <div className="overlay-edit">📷</div>}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onSelectFile}
              style={{ display: "none" }}
              accept="image/*"
            />
          </div>

          <div className="perfil-info">
            <div className="perfil-info-header">
              <h2>{nombre || "Nombre del Usuario"}</h2>
              <button 
                className={`btn-editar ${isEditing ? "btn-guardar" : ""}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Guardar" : "Editar Perfil"}
              </button>
            </div>
            <div className="perfil-stats">
              <span>Seguidores: 25</span>
              <span>Seguidos: 18</span>
            </div>
            <div className="perfil-stars">{renderStars()}</div>

            <div className="perfil-tabs">
            <button
              className={activeTab === "descripcion" ? "tab active" : "tab"}
              onClick={() => setActiveTab("descripcion")}
            >
              Descripción
            </button>
            <button
              className={activeTab === "anuncios" ? "tab active" : "tab"}
              onClick={() => setActiveTab("anuncios")}
            >
              Anuncios
            </button>
            <button
              className={activeTab === "resenas" ? "tab active" : "tab"}
              onClick={() => setActiveTab("resenas")}
            >
              Reseñas
            </button>
          </div>
          </div>
        </div>
      </div>

      <div className="perfil-scroll-container">
        <div className="perfil-content">
          {activeTab === "descripcion" && (
            <div className="perfil-descripcion-layout">
              <div className="etiquetas-section">
                <h4>Etiquetas</h4>
                <div className="etiquetas-container">
                  {etiquetas.map((etiqueta, index) => (
                    <div key={index} className="etiqueta-tag">
                      <span>{etiqueta}</span>
                      {isEditing && (
                        <button 
                          className="btn-eliminar-etiqueta"
                          onClick={() => eliminarEtiqueta(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="etiqueta-input-group">
                    <input
                      type="text"
                      value={nuevaEtiqueta}
                      onChange={(e) => setNuevaEtiqueta(e.target.value)}
                      placeholder="Nueva etiqueta..."
                      onKeyPress={(e) => e.key === "Enter" && agregarEtiqueta()}
                    />
                    <button onClick={agregarEtiqueta}>+ Añadir</button>
                  </div>
                )}
              </div>

              <h3>Descripción</h3>
              {isEditing ? (
                <textarea
                  className="descripcion-textarea"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Escribe algo sobre ti..."
                />
              ) : (
                <div className="descripcion-texto">
                  {descripcion || "No hay descripción disponible."}
                </div>
              )}
            </div>
          )}

          {activeTab === "anuncios" && (
            <div className="perfil-anuncios">
              <div className="anuncios-header">
                <h3>Mis Anuncios</h3>
                <div className="ordenar-por">
                  <label>Ordenar por:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="reciente">Más Reciente</option>
                    <option value="precio-asc">Menor Precio</option>
                    <option value="precio-desc">Mayor Precio</option>
                  </select>
                </div>
              </div>

              <div className="anuncios-grid">
                {multimediaOrdenada.length > 0 ? (
                  multimediaOrdenada.map((media, index) => (
                    <div key={index} className="anuncio-card">
                      <div className="anuncio-media">
                        {media.type && media.type.startsWith("image/") ? (
                          <img src={media.url} alt={`media-${index}`} />
                        ) : (
                          <video src={media.url} controls />
                        )}
                      </div>
                      <div className="anuncio-info">
                        <h4 className="anuncio-titulo">{media.titulo || "Título del anuncio"}</h4>
                        <p className="anuncio-descripcion">{media.descripcion || "Descripción del anuncio"}</p>
                        <div className="anuncio-precio">
                          <span className="precio-cantidad">{media.precio || 0}€</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="sin-anuncios">No hay anuncios aún.</p>
                )}
              </div>
              {isEditing && (
                <>
                  <button
                    className="btn-anadir"
                    onClick={() => multimediaInputRef.current.click()}
                  >
                    + Añadir Anuncio
                  </button>
                  <input
                    type="file"
                    ref={multimediaInputRef}
                    onChange={handleMultimediaChange}
                    style={{ display: "none" }}
                    accept="image/*,video/*"
                    multiple
                  />
                </>
              )}
            </div>
          )}

          {activeTab === "resenas" && (
            <div className="perfil-resenas">
              <div className="resenas-header">
                <div className="resenas-stats">
                  <div className="resenas-rating">
                    <span className="rating-numero">{promedioValoracion}</span>
                    <div className="resenas-stars">
                      {renderReviewStars(Math.round(promedioValoracion))}
                    </div>
                  </div>
                  <div className="resenas-info">
                    <p className="total-resenas">{totalResenas} reseñas</p>
                  </div>
                </div>
              </div>

              <div className="resenas-list">
                {resenas.length > 0 ? (
                  resenas.map((resena) => (
                    <div key={resena.id} className="resena-card">
                      <div className="resena-header">
                        <div className="resena-user">
                          <img src={resena.foto} alt={resena.autor} className="resena-avatar" />
                          <div className="resena-user-info">
                            <h4 className="resena-autor">{resena.autor}</h4>
                            <span className="resena-stats-small">{resena.numResenas} reseñas · {resena.numFotos} fotos</span>
                          </div>
                        </div>
                        <button className="resena-menu">⋮</button>
                      </div>

                      <div className="resena-content">
                        <div className="resena-stars-rating">
                          {renderReviewStars(resena.valoracion)}
                        </div>
                        <span className="resena-fecha">{resena.fecha}</span>
                      </div>

                      <p className="resena-texto">{resena.texto}</p>
                    </div>
                  ))
                ) : (
                  <p className="sin-resenas">No hay reseñas aún.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MiPerfilSenior;
