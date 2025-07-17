// src/components/Logout.js
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Logout = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout()); // Optional if using onAuthStateChanged
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
