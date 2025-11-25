import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import ChangeIcon from './hook/ChangeIcon'
import ChangeTitle from './hook/ChangeTitle'
import Header from "./components/Header"
import Icon from "./components/Icon"

import Welcome from "./routes/Welcome"
import Error from "./routes/Error"
import Feed from "./routes/Feed"
import Chat from "./routes/Chat"
import Publish from "./routes/Publish"
import Notifications from "./routes/Notifications"
import Profile from "./routes/Profile"
import Footer from "./components/Footer"
import Devs from "./routes/Devs"
import Auth from "./routes/Auth"
import Settings from "./routes/Settings"
import Introduction from "./components/ui/Introduction"
import Interests from "./components/ui/Interests"
import About from "./components/ui/About"
import Experiences from "./components/ui/Experiences"
import Academic from "./components/ui/Academic"
import Projects from "./components/ui/Projects"
import Courses from "./components/ui/Courses"
import Languages from "./components/ui/Languages"
import Skills from "./components/ui/Skills"
import User from "./routes/User"
import FeedProfile from "./routes/FeedProfile"
import Ranking from "./routes/Ranking"

import { ThemeProvider } from "./hook/ThemeContext"
import Appearance from "./components/ui/Appearance"

function App() {

  ChangeIcon();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        <ChangeTitle />
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Error />} />
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/developers" element={<Devs />} />
          <Route path="/user/:id" element={<User />} />
          <Route path="/user/:id/feed profile" element={<FeedProfile />} />
          <Route path="/ranking" element={<Ranking />} />

          <Route path="/settings" element={<Settings />} >
            <Route path="introduction" element={<Introduction />} />
            <Route path="interests" element={<Interests />} />
            <Route path="about" element={<About />} />
            <Route path="Experiences" element={<Experiences />} />
            <Route path="academic" element={<Academic />} />
            <Route path="projects" element={<Projects />} />
            <Route path="courses" element={<Courses />} />
            <Route path="languages" element={<Languages />} />
            <Route path="skills" element={<Skills />} />
            <Route path="appearance" element={<Appearance />} />
            <Route path="accessibility" element={<Introduction />} />
            <Route path="terms and Privacy" element={<Introduction />} />
            <Route path="support" element={<Introduction />} />
          </Route>

        </Routes>
        <Icon />
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
