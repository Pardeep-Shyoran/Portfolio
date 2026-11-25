import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

/**
 * Emits route-specific Schema.org JSON-LD structured data into <head>.
 */
const StructuredData = ({ data }) => {
  if (!data) return null

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}

StructuredData.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
}

export default StructuredData
