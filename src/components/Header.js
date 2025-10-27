import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ title, showBack = true, showLogout = false  }) {
  const navigate = useNavigate();
  const location = useLocation();

  
  const handleBack = () => {
     if (location.pathname == "/chat") {
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

      <h1 className="header-title">{title}</h1>

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
