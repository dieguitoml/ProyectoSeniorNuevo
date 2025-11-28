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

   const renderLittleStars = () => {
    const total = 5;
    return Array.from({ length: total }).map((_, i) => (
      <span key={i} className={i < valoracion ? "little-stars filled" : "little-stars"}>
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
              <span>Seguidores <strong>25</strong></span>
              <span>Seguidos   <strong>18</strong></span>
            </div>
            <div className="perfil-valoracion">
            <div className="perfil-stars">{renderStars()}
              </div>
              <span className="numero-valoraciones">128 valoraciones</span>
            </div>

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
            className={activeTab === "reseñas" ? "tab active" : "tab"}
            onClick={() => setActiveTab("reseñas")}
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
              {/* LAYOUT FOTO + DESCRIPCIÓN */}
              <div className="descripcion-layout">
                

                <div className="descripcion-main">
                  {/* SECCIÓN ETIQUETAS */}
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
              </div>
            </div>
          )}

          {activeTab === "anuncios" && (
            <div className="perfil-anuncios">
              <div className="anuncios-header">
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
        </div>
      </div>
    </div>
  );
}

export default MiPerfilSenior;
