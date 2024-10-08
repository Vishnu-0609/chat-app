import axios from "axios";
import React, { Suspense, lazy, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SocketProvider } from './Socket.jsx';
import ProtectRoute from './components/auth/ProtectRoute.jsx';
import { server } from './components/constatnts/config.js';
import Loaders from './components/layout/Loaders.jsx';
import { userExists, userNotExists } from './redux/slices/auth.js';

const Home = lazy(()=>import('./pages/Home.jsx'))
const Login = lazy(()=>import('./pages/Login.jsx'))
const Chat = lazy(()=>import('./pages/Chat.jsx'))
const Group = lazy(()=>import('./pages/Groups.jsx'))
const NotFound = lazy(()=>import('./pages/NotFound.jsx'))
const AdminLogin = lazy(()=>import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(()=>import('./pages/admin/Dashboard.jsx'));
const UserManagement = lazy(()=>import('./pages/admin/UserManagement.jsx'));
const ChatManagement = lazy(()=>import('./pages/admin/ChatManagement.jsx'));
const MessageManagement = lazy(()=>import('./pages/admin/MessageManagement.jsx'));

// let user = true;

function App() {

  const dispatch = useDispatch();
  const {user,loader,isAdmin} = useSelector(state=>state.auth)

  useEffect(()=>{
    axios.get(`${server}/api/v1/user/profile`,{withCredentials:true}).then(({data})=>dispatch(userExists(data))).catch((error)=>dispatch(userNotExists()))
  },[dispatch])

  return loader ? <Loaders/> : (
      <Router>
        <Suspense fallback={<Loaders/>}>
          <Routes>
            <Route element={<SocketProvider><ProtectRoute user={user}/></SocketProvider>}>
              <Route path='/' element={<Home />}/>
              <Route path='/chat/:chatId' element={<Chat/>}/>
              <Route path='/groups' element={<Group/>}/>
            </Route>
            <Route path='/login' element={<ProtectRoute user={!user} redirect='/'><Login/></ProtectRoute>}/>
            <Route path="/admin" element={<AdminLogin/>}/>
            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
            <Route path="/admin/users" element={<UserManagement/>}/>
            <Route path="/admin/chats" element={<ChatManagement/>}/>
            <Route path="/admin/messages" element={<MessageManagement/>}/>
            <Route path='*' element={<NotFound />}/>
          </Routes>
        </Suspense>
        <Toaster/>
      </Router>
  )
}

export default App
