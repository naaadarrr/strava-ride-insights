import React from 'react';
import logo from '../assets/logo.png';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export function Logo({ className = '', ...props }: LogoProps) {
  return <img src={logo} alt="logo" className={className} {...props} />;
}
