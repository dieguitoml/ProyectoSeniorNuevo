import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  //  ESTO NO FUNCIONAAAA PARA CHATS
  const handleBack = () => {
     if (location.pathname.startsWith("/chat/") && location.pathname !== "/chat") {
      navigate("/chat", { replace: true });
      return;
    } else {
      navigate(-1); 
    }
  };

  return (
    <header className="new-app-header">
       <button onClick={handleBack} className="header-btn back-btn">
        <span>&larr;</span> Atrás
      </button>
       <h1 className="header-title">{title}</h1>

      <button onClick={() => navigate('/')} className="header-btn home-btn">
        <span>&#8962;</span> Inicio
      </button>
    </header>
  );
}


export default Header;
