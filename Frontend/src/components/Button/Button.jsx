import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  onClick,
  variant = 'primary', // 'primary' | 'secondary'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  disabled = false,
  href = null,
  target = '_blank',
  ...rest
}) => {
  const buttonClasses = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={buttonClasses}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
