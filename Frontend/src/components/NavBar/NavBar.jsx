import styles from './NavBar.module.css'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const NavBar = () => {
  const handleClick = (e, targetId) => {
    e.preventDefault()
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
      <a className={styles.NavLink} href="#projects" onClick={(e) => handleClick(e, 'projects')}>Projects</a>
      <a className={styles.NavLink} href="#contact" onClick={(e) => handleClick(e, 'contact')}>Contact</a>
    </div>
  )
}

export default NavBar