import { useState } from 'react'
import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/main/Main'

function App() {
  const [selectedImages, setSelectedImages] = useState([]);

  return (
    <>
      <div className="wrapper">
        <header className="header">
          <Header setSelectedImages={setSelectedImages} />
        </header>
        <main className="main">
          {selectedImages.length == 0 ? null :<Main selectedImages={selectedImages} />}
          {/* <Main selectedImages={selectedImages} /> */}
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default App
