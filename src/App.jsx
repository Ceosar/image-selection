import { useEffect, useState, } from 'react'
import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/main/Main'
import Auth from './components/auth/Auth'

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("Token") || "");
  // const [fn_file, setFn_file] = useState("");
  const [pictures, setPictures] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meterData, setMeterData] = useState([]);

  useEffect(() => {
    localStorage.setItem('Token', token);
  }, [token])

  if (token) {
    return (
      <>
        <div className="wrapper">
            <header className="header">
              <Header setMeterData={setMeterData} pictures={pictures} setPictures={setPictures} currentIndex={currentIndex} setSelectedImages={setSelectedImages} setToken={setToken} token={token} />
            </header>
            <main className="main">
              {/* {selectedImages.length == 0 ? null : <Main selectedImages={selectedImages} fn_file={fn_file} />} */}
              <Main meterData={meterData} pictures={pictures} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} selectedImages={selectedImages} />
            </main>
            <footer className="footer">
              {/* <Footer /> */}
            </footer>
        </div>
      </>
    )
  } else {
    return (
      <>
        <div className="wrapper">
          <Auth setToken={setToken} />
        </div>
      </>
    )
  }
}

export default App
