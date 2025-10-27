import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import perfilEjemplo from "../assets/perfil-generico.png";


function Header({ title, showBack = true, showLogout = false  , showTitle = true, otherUser = null}) {
  const navigate = useNavigate();
  const location = useLocation();

  
  const handleBack = () => {
     if (location.pathname === "/chat") {
      navigate("/menu-senior", { replace: true });
      return;
    } else {
      navigate(-1); 
    }
  };

  const handleLogout = () => {
    // aquí puedes limpiar sesión, token, etc.
    navigate("/", { replace: true });
  };

  return (
    <header className="new-app-header">
      {showBack && (
        <button onClick={handleBack} className="header-btn back-btn">
          <span>&larr;</span> Atrás
        </button>
      )}
      {showTitle && ( 
        <h1 className="header-title">{title}</h1>
      )}
      {!showTitle && (
        <button>
          <div className = "header-title chat-user-info">
            <img
              src={otherUser?.imagen || perfilEjemplo}
              alt="Perfil"
              className="chat-profile-pic"
            />
            <span>{otherUser?.name || "Cargando..."}</span>
          </div>
        </button>
      )}

      {showLogout ? (
        <button onClick={handleLogout} className="header-btn logout-btn">
          <span>&#x2716;</span> Cerrar sesión
        </button>
      ) : (
        <button onClick={() => navigate('/')} className="header-btn home-btn">
          <span>&#8962;</span> Inicio
        </button>
      )}
    </header>
  );
}


export default Header;
