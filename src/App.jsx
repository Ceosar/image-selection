import { useEffect, useState } from 'react'
import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/main/Main'
import Auth from './components/auth/Auth'

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("Token") || "");
  const [fn_file, setFn_file] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem('Token', token);
  }, [token])

  if (token) {
    return (
      <>
        <div className="wrapper">
          <header className="header">
            <Header currentIndex={currentIndex} setSelectedImages={setSelectedImages} setToken={setToken} token={token} fn_file={fn_file} setFn_file={setFn_file} />
          </header>
          <main className="main">
            {/* {selectedImages.length == 0 ? null : <Main selectedImages={selectedImages} fn_file={fn_file} />} */}
            <Main currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} selectedImages={selectedImages} fn_file={fn_file} />
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
