import './App.css'
import Footer from './components/footer/Footer'
import Header from './components/header/Header'
import Main from './components/main/Main'

function App() {

  return (
    <>
      <div className="wrapper">
        <header className="header">
          <Header />
        </header>
        <main className="main">
          <Main />
        </main>
        <footer className="footer">
          <Footer />
        </footer>
      </div>
    </>
  )
}

export default App
