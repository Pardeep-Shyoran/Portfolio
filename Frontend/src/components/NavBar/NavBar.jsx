import styles from './NavBar.module.css'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e, targetId) => {
    e.preventDefault()
    
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/')
      // Use setTimeout to allow navigation to complete before scrolling
      setTimeout(() => {
        scrollToElement(targetId)
      }, 100)
    } else {
      // Already on home page, scroll directly
      scrollToElement(targetId)
    }
  }

  const scrollToElement = (targetId) => {
    const element = document.getElementById(targetId)
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: element,
          offsetY: 0
        },
        ease: 'power2.inOut'
      })
    }
  }

  return (
    <div className={styles.NavBar}>
      <a className={styles.NavLink} href="#home" onClick={(e) => handleClick(e, 'home')}>Home</a>
      <a className={styles.NavLink} href="#about" onClick={(e) => handleClick(e, 'about')}>About</a>
      <a className={styles.NavLink} href="#featuredProjects" onClick={(e) => handleClick(e, 'featuredProjects')}>Projects</a>
      <a className={styles.NavLink} href="#certificates" onClick={(e) => handleClick(e, 'certificates')}>Certificates</a>
      <a className={styles.NavLink} href="#contact" onClick={(e) => handleClick(e, 'contact')}>Contact</a>
    </div>
  )
}

export default NavBar