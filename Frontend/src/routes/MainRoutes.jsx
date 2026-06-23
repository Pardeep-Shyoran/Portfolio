import React, { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'

// Lazy load non-landing page views
const About = lazy(() => import('../pages/About/About'))
const Contact = lazy(() => import('../pages/Contact/Contact'))
const Projects = lazy(() => import('../pages/Projects/Projects'))
const Stats = lazy(() => import('../pages/Stats/Stats'))

const PageLoader = () => (
  <div style={{
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--background-color)',
    color: 'var(--text-color)',
    letterSpacing: '1px',
    opacity: 0.6
  }}>
    <div>LOADING...</div>
  </div>
)

const MainRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Suspense>
  )
}

export default MainRoutes