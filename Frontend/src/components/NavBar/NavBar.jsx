import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'

const NavBar = () => {
  return (
    <div className={styles.NavBar}>
      <NavLink className={styles.NavLink} to="/">Home</NavLink>
      <NavLink className={styles.NavLink} to="/about">About</NavLink>
      <NavLink className={styles.NavLink} to="/projects">Projects</NavLink>
      <NavLink className={styles.NavLink} to="/contact">Contact</NavLink>
    </div>
  )
}

export default NavBar