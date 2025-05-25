import { useEffect, useState } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('Cargando...');

  useEffect(() => {
    fetch('/api/saludo') // Gracias al "proxy" no necesitas poner el localhost:5000
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(err => {
        console.error('Error al conectar con el backend:', err);
        setMensaje('Error al conectar con el backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Mensaje desde el backend:</h1>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
