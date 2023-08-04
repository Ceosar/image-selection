import { Suspense, useEffect, useState, lazy } from 'react'
import './App.css'
import Footer from './components/footer/Footer'
import Loading from './components/loading/Loading'
import Main from './components/main/Main'
import Header from './components/header/Header'
import Auth from './components/auth/Auth'

function App() {
  const [token, setToken] = useState(localStorage.getItem("Token") || "");
  const [pictures, setPictures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meterData, setMeterData] = useState([]);

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
              setToken={setToken}
              token={token}
            />
          </header>
          <main className="main">
            <Main
              meterData={meterData}
              pictures={pictures}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
            />
          </main>
          <footer className="footer">
            {/* <Footer /> */}
          </footer>
        </>
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  )
}

export default App
