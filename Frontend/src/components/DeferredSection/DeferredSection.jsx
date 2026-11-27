import { Suspense, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { MOUNT_SECTION_EVENT } from '../../utils/sectionMount'

/**
 * Defers mounting of below-the-fold React.lazy sections until they approach
 * the viewport or are explicitly requested (e.g. via navigation or WebMCP tools).
 */
const DeferredSection = ({
  id,
  matchIds,
  minHeight = '280px',
  rootMargin = '450px',
  render,
}) => {
  const [shouldMount, setShouldMount] = useState(false)
  const placeholderRef = useRef(null)

  useEffect(() => {
    if (shouldMount) return undefined

    const targets = new Set(matchIds && matchIds.length > 0 ? matchIds : [id])

    const handleMountRequest = (event) => {
      const targetId = event?.detail?.id
      if (targetId === '*' || targets.has(targetId)) {
        setShouldMount(true)
      }
    }

    window.addEventListener(MOUNT_SECTION_EVENT, handleMountRequest)

    const node = placeholderRef.current
    let observer = null
    if (node && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setShouldMount(true)
            observer?.disconnect()
          }
        },
        { rootMargin }
      )
      observer.observe(node)
    }

    return () => {
      window.removeEventListener(MOUNT_SECTION_EVENT, handleMountRequest)
      observer?.disconnect()
    }
  }, [id, matchIds, rootMargin, shouldMount])

  if (!shouldMount) {
    return <div ref={placeholderRef} id={id} style={{ minHeight }} />
  }

  return (
    <Suspense fallback={<div id={id} style={{ minHeight }} />}>
      {render()}
    </Suspense>
  )
}

DeferredSection.propTypes = {
  id: PropTypes.string.isRequired,
  matchIds: PropTypes.arrayOf(PropTypes.string),
  minHeight: PropTypes.string,
  rootMargin: PropTypes.string,
  render: PropTypes.func.isRequired,
}

export default DeferredSection
