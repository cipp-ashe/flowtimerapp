import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children,
  onClick 
}: ButtonProps) => {
  // Base classes that are always applied
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  /* 
    baseClasses breakdown:
    - inline-flex: Creates an inline flexbox container
    - items-center: Centers items vertically
    - justify-center: Centers items horizontally
    - rounded-md: Applies medium border radius
    - font-medium: Sets font weight to medium
    - transition-colors: Enables smooth color transitions
    - focus-visible:outline-none: Removes default focus outline
    - focus-visible:ring-2: Adds a 2px focus ring
    - focus-visible:ring-offset-2: Adds 2px offset to focus ring
  */
  
  // Size-specific classes
  const sizeClasses = {
    sm: "h-8 px-4 text-sm", // Small size (height: 2rem, horizontal padding: 1rem)
    md: "h-10 px-6 text-base", // Medium size (height: 2.5rem, horizontal padding: 1.5rem)
    lg: "h-12 px-8 text-lg" // Large size (height: 3rem, horizontal padding: 2rem)
  };

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    /* 
      primary variant breakdown:
      - bg-blue-600: Sets background color to medium blue
      - text-white: Sets text color to white
      - hover:bg-blue-700: Darkens background on hover
      - focus-visible:ring-blue-500: Sets focus ring color to lighter blue
    */
    
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus-visible:ring-gray-500",
    /* 
      secondary variant breakdown:
      - bg-gray-600: Sets background color to medium gray
      - text-white: Sets text color to white
      - hover:bg-gray-700: Darkens background on hover
      - focus-visible:ring-gray-500: Sets focus ring color to lighter gray
    */
    
    outline: "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus-visible:ring-gray-500"
    /* 
      outline variant breakdown:
      - border-2: Sets border width to 2px
      - border-gray-300: Sets border color to light gray
      - text-gray-700: Sets text color to dark gray
      - hover:bg-gray-50: Adds very light gray background on hover
      - focus-visible:ring-gray-500: Sets focus ring color to medium gray
    */
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
