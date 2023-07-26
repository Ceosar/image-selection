import { useEffect, useState } from 'react'
import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/main/Main'
import Auth from './components/auth/Auth'

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("Token") || "");

  useEffect(() => {
    localStorage.setItem('Token', token);
  }, [token])

  if (token) {
    return (
      <>
        <div className="wrapper">
          <header className="header">
            <Header setSelectedImages={setSelectedImages} setToken={setToken} token={token} />
          </header>
          <main className="main">
            {selectedImages.length == 0 ? null : <Main selectedImages={selectedImages} />}
            {/* <Main selectedImages={selectedImages} /> */}
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
