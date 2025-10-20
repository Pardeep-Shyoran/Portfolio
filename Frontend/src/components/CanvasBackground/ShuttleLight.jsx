import React from 'react';
import styles from './ShuttleLight.module.css';

/**
 * ShuttleLight renders a glowing light effect from the top and behind the header.
 */
const ShuttleLight = () => {
  return (
    <div className={styles.shuttleLight} aria-hidden="true" />
  );
};

export default ShuttleLight;
