import { NavLink } from 'react-router-dom'
import styles from './Logo.module.css'

const Logo = () => {
  return (
    <div className={styles.Logo}>
      {/* <img className={styles.LogoImage} src="https://ik.imagekit.io/00zfvrear/Images/Minimalist%20Portfolio%202025%20Logo.png?updatedAt=1760628128351" alt="" /> */}
        <NavLink to="/" className={styles.LogoText}>Pardeep Shyoran</NavLink>
    </div>
  )
}

export default Logo