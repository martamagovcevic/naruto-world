
import { Routes, Route } from 'react-router-dom'

import Intro from './  components/Intro/Intro'
import Navbar from './  components/NavBar/NavBar'
import Footer from './  components/Footer/Footer'

import HomePage from './pages/HomaPage'
import CharactersPage from './pages/CharacterPage'
import CharacterProfilePage from './pages/CharacterProfilePage'
import VillagesPage from './pages/VillagesPage'
import JutsuPage from './pages/JutsuPage'
import JutsuDetailPage from './pages/JutsuDetailPage'
import AkatsukiPage from './pages/AkatsukiPage'
import ClansPage from './pages/ClansPage'

function App() {
  return (
    <>
      <Intro />

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/characters" element={<CharactersPage />} />

        <Route
          path="/characters/:id"
          element={<CharacterProfilePage />}
        />

        <Route path="/villages" element={<VillagesPage />} />
        <Route path="/jutsu" element={<JutsuPage />} />

        <Route path="/jutsu/:id" element={<JutsuDetailPage />} />

        <Route path="/clans" element={<ClansPage />} />

        <Route path="/akatsuki" element={<AkatsukiPage />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
