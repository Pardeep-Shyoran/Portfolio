import { NavLink, useLocation } from 'react-router-dom'
import styles from './Logo.module.css'
import { smoothScrollTo } from '../../utils/scrollHelper'

const DARK_THEME_LOGO = 'https://ik.imagekit.io/00zfvrear/Images/Minimalist%20Cream%20Ribbon%20F%20Logo.png?updatedAt=1792666504824'
const LIGHT_THEME_LOGO = 'https://ik.imagekit.io/00zfvrear/Images/Abstract%20S-P%20Monogram%20Emblem-Photoroom.png?updatedAt=1792666504838'

const Logo = () => {
  const location = useLocation()

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      smoothScrollTo(0)
    }
  }

  return (
    <div className={styles.Logo}>
      <NavLink
        to="/"
        onClick={handleLogoClick}
        className={styles.LogoLink}
        aria-label="Pardeep Shyoran — Return to Home"
      >
        <span className={styles.logoMark} aria-hidden="true">
          {/* Cream emblem displayed on Dark Theme background */}
          <img
            src={DARK_THEME_LOGO}
            alt=""
            className={`${styles.logoImg} ${styles.darkThemeLogo}`}
            loading="eager"
            decoding="async"
          />
          {/* Dark emblem displayed on Light Theme background */}
          <img
            src={LIGHT_THEME_LOGO}
            alt=""
            className={`${styles.logoImg} ${styles.lightThemeLogo}`}
            loading="eager"
            decoding="async"
          />
        </span>
        <span className={styles.brandName}>Pardeep Shyoran</span>
        <span className={styles.accentDot} aria-hidden="true">.</span>
      </NavLink>
    </div>
  )
}

export default Logo