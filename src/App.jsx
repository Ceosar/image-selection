import { useEffect, useState } from 'react'
import './App.css'
import Main from './components/main/Main'
import Header from './components/header/Header'
import Auth from './components/auth/Auth'
import Popup from './components/main/popup/Popup'

function App() {
  const [token, setToken] = useState(localStorage.getItem("Token") || "");
  const [pictures, setPictures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meterData, setMeterData] = useState([]);
  const [notification, setNotification] = useState(false);

  const showNotification = (message, color) => {
    setNotification({
      active: true,
      message,
      color
    });

    setTimeout(() => {
      setNotification({
        active: false,
        message: '',
        color: ''
      });
    }, 2000);
  }

  useEffect(() => {
    localStorage.setItem('Token', token);
  }, [token])

  return (
    <div className="wrapper">
      {token ? (
        <>
          <header className="header">
            <Header
              setMeterData={setMeterData}
              pictures={pictures}
              setPictures={setPictures}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              setToken={setToken}
              token={token}
              showNotification={showNotification}
            />
          </header>
          <main className="main">
            {notification && <Popup message={notification.message} color={notification.color} />}
            <Main
              meterData={meterData}
              pictures={pictures}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              showNotification={showNotification}
            />
          </main>
          <footer className="footer">
            {/* <Footer /> */}
          </footer>
        </>
      ) : (
        <div className='auth_app'>
          <Auth setToken={setToken} />
        </div>
      )}
    </div>
  )
}

export default App
