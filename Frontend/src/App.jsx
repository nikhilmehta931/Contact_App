//import Register from "../pages/Register/Register"
//import Login from "../pages/Login/Login";
import Contacts from './pages/AddContact/Contacts/Contacts';
import 'react-toastify/dist/ReactToastify.css';
import ContactForm from './components/ContactForm/ContactForm';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register"
import Logout from "./components/Logout/Logout"
import "./App.css"

function App() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  return (
    <>
      <Routes>
        <Route path="/" Component={() => {
          return token ? Navigate({ to: '/home' }) : Navigate({ to: '/login' })
        }} />
        <Route path='/home' Component={Contacts} />
        <Route path="/add-contact" Component={ContactForm} />
        <Route path="/update-contact/:contact_id" Component={ContactForm} />
        <Route path="/register" Component={Register} />
        <Route path="/login" Component={Login} />
        {/* <Route path="/logout" Component={Logout} /> */}
      </Routes>
        
      {
        token ? (<button className='logout' onClick={() => {
          localStorage.removeItem('token')
          navigate('/login')
        }}>Logout</button>) : null
      }
    </>
  )
}

export default App;
