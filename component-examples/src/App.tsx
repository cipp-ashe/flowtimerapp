import { useState } from 'react'
import { Card } from './components/Card'
import { Button } from './components/Button'

function App() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 
        className breakdown:
        - min-h-screen: Minimum height of 100vh (full viewport height)
        - bg-gray-50: Light gray background
        - py-12: Vertical padding of 3rem
        - px-4: Horizontal padding of 1rem on small screens
        - sm:px-6: Horizontal padding of 1.5rem on medium screens
        - lg:px-8: Horizontal padding of 2rem on large screens
      */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Interactive Component Showcase
        </h1>

        {/* Card Component Demo */}
        <section className="component-demo">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Card Component</h2>
          
          <div className="mb-6">
            <Card
              title="Example Card"
              description="This card component demonstrates various Tailwind CSS utilities for creating a modern, interactive card design."
              imageUrl="https://images.unsplash.com/photo-1706293861667-0b27f79a5506?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            />
          </div>

          <div className="explanation">
            <h3 className="font-semibold mb-2">Key Features:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">max-w-sm</code>: Limits card width to 24rem (384px)</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">shadow-lg</code>: Adds a large drop shadow for depth</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">hover:shadow-xl</code>: Increases shadow on hover</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">space-y-4</code>: Adds vertical spacing between elements</li>
            </ul>
          </div>
        </section>

        {/* Button Component Demo */}
        <section className="component-demo">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Button Component</h2>
          
          <div className="space-y-4">
            <div className="space-x-4">
              <Button variant="primary" onClick={() => setClickCount(c => c + 1)}>
                Primary Button
              </Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
            </div>

            <div className="space-x-4">
              <Button variant="primary" size="sm">Small</Button>
              <Button variant="primary" size="md">Medium</Button>
              <Button variant="primary" size="lg">Large</Button>
            </div>

            {clickCount > 0 && (
              <p className="text-sm text-gray-600">
                Button clicked {clickCount} times!
              </p>
            )}
          </div>

          <div className="explanation mt-6">
            <h3 className="font-semibold mb-2">Button Variants:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">primary</code>: Blue background with white text</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">secondary</code>: Gray background with white text</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">outline</code>: Transparent with border</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Size Classes:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">h-8 px-4 text-sm</code>: Small size</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">h-10 px-6 text-base</code>: Medium size</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">h-12 px-8 text-lg</code>: Large size</li>
            </ul>

            <h3 className="font-semibold mt-4 mb-2">Utility Classes Used:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><code className="bg-gray-100 px-2 py-1 rounded">space-y-4</code>: Adds vertical spacing of 1rem between elements</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">space-x-4</code>: Adds horizontal spacing of 1rem between elements</li>
              <li><code className="bg-gray-100 px-2 py-1 rounded">transition-colors</code>: Smooth color transitions on hover/focus</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
