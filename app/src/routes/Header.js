// import useContext
import { useContext } from 'react';
// import Context
import Context from '../Context';
// import react router
import { useHistory } from 'react-router-dom';


function Header() {
  const { user, setUser } = useContext(Context);

  const history = useHistory();

  /**
   * logout
   */
  const logout = () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      history.push('logout')
    }
  }

  return (
    <div className="header">
      <div className="header__left">
        <img src='./logomain.png' alt="Uber Clone" />
        {
          user && (
            <div className="header__right">
              <img src={user.avatar} alt={user.email}/>
              <span>Hello, {user.email}</span>
            </div>
          )
        }
      </div>
      <span className="header__logout" onClick={logout}><span>Logout</span></span>
    </div>
  );
}

export default Header;
