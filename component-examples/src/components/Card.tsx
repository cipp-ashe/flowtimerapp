import React from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
}

// This is our example Card component that demonstrates various Tailwind CSS classes
export const Card = ({ title, description, imageUrl }: CardProps) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {/* 
        className breakdown:
        - max-w-sm: Sets maximum width to small (24rem/384px)
        - rounded-lg: Applies large border radius
        - overflow-hidden: Clips content that exceeds container
        - shadow-lg: Adds large drop shadow
        - hover:shadow-xl: Increases shadow size on hover
        - transition-shadow: Enables smooth transition of shadow property
        - duration-300: Sets transition duration to 300ms
      */}
      {imageUrl && (
        <img 
          className="w-full h-48 object-cover"
          src={imageUrl} 
          alt={title}
        />
      )}
      <div className="p-6 space-y-4">
        {/* 
          space-y-4: Adds vertical spacing of 1rem between child elements
          p-6: Adds padding of 1.5rem (24px) on all sides
        */}
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {/* 
            text-xl: Sets font size to extra large
            font-bold: Sets font weight to bold
            text-gray-800: Sets text color to dark gray
            mb-2: Adds margin bottom of 0.5rem
          */}
          {title}
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {/* 
            text-gray-600: Sets text color to medium gray
            leading-relaxed: Sets comfortable line height for readability
          */}
          {description}
        </p>
      </div>
    </div>
  );
};
