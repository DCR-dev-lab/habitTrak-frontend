import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CreateHabit from './pages/CreateHabit.jsx'
import HabitDetails from './pages/HabitDetails.jsx'
import Profile from './pages/Profile.jsx'
import Challenges from "./pages/Challenges";
import ChallengeCreate from "./pages/ChallengeCreate";
import ChallengeLeaderboard from "./pages/ChallengeLeaderboard";
import NotFound from './pages/NotFound.jsx'


import ProtectedRoute from './components/ProtectedRoute.jsx'

const App = () => {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/dashboard' element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route
        path="/create-habit"
        element={
          <ProtectedRoute>
            <CreateHabit />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habit/:id"
        element={
          <ProtectedRoute>
            <HabitDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Challenges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenge/create"
        element={
          <ProtectedRoute>
            <ChallengeCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenge/:id"
        element={
          <ProtectedRoute>
            <ChallengeLeaderboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />

    </Routes>


  )
}

export default App
