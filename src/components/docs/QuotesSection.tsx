import React, { useState } from 'react';
import { FloatingQuotes } from "@/components/quotes/FloatingQuotes";
import { type Quote } from "@/types/timer/models";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Settings2, Code, Layers, Sparkles, Heart } from "lucide-react";

export const QuotesSection: React.FC = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const allQuotes: Quote[] = [{
      text: "Start where you are. Use what you have. Do what you can.",
      author: "Arthur Ashe",
      categories: ['motivation', 'progress']
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain",
      categories: ['focus', 'productivity']
    },
    {
      text: "Small progress is still progress.",
      author: "Unknown",
      categories: ['growth', 'motivation']
    }
  ];
  
  const [likedQuotes, setLikedQuotes] = useState<Quote[]>([]);

  return (
    <section id="quotes" className="space-y-8">
      <header className="text-center space-y-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-primary">Motivational Quotes</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Dynamic quote display with physics-based animations and interactive features
        </p>
      </header>

      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl shadow-xl border border-border/50 overflow-hidden max-w-3xl mx-auto">
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium mb-4">Interactive Demo</h3>
            
            {/* Timer-style Quote Display */}
            <div className="bg-card/30 backdrop-blur-sm p-8 rounded-lg text-center space-y-4">
              <blockquote className="text-lg font-light italic leading-relaxed text-primary/80" style={{ textShadow: '1px 1px 5px rgba(0, 0, 0, 0.1)' }}>
                "{allQuotes[currentQuoteIndex].text}"
              </blockquote>
              <p className="text-sm text-primary/60">— {allQuotes[currentQuoteIndex].author}</p>
              <button
                onClick={() => {
                  const quote = allQuotes[currentQuoteIndex];
                  if (!likedQuotes.find(q => q.text === quote.text)) {
                    setLikedQuotes([...likedQuotes, quote]);
                  }
                  setCurrentQuoteIndex((prev) => (prev + 1) % allQuotes.length);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span>Like & Next Quote</span>
              </button>
            </div>
            
            {/* Floating Quotes Area */}
            <div className="h-[300px] relative bg-card/30 backdrop-blur-sm rounded-lg overflow-hidden">
              <FloatingQuotes favorites={likedQuotes} />
              {likedQuotes.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-primary/60">
                  Like quotes to see them float here
                </div>
              )}
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="technical">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  <span>Technical Implementation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-6 p-4">
                  {/* Physics Engine */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4" />
                      Physics Engine
                    </h4>
                    <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`// Custom physics engine for natural movement
class PhysicsParticle {
  constructor(x, y, mass = 1) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.mass = mass;
  }

  applyForce(force) {
    // F = ma -> a = F/m
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update(dt) {
    // Verlet integration for smooth motion
    this.velocity.x += this.acceleration.x * dt;
    this.velocity.y += this.acceleration.y * dt;
    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
    
    // Reset acceleration
    this.acceleration = { x: 0, y: 0 };
  }
}`}</code>
                    </pre>
                  </div>

                  {/* Animation System */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4" />
                      Animation System
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium mb-2">Base Animation</h5>
                        <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{`.quote-float {
  animation: float 8s ease-in-out infinite;
  transform-origin: center;
  transition: all 0.3s ease;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}`}</code>
                        </pre>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium mb-2">Interaction Effects</h5>
                        <pre className="bg-muted/30 p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{`.quote-card {
  backdrop-filter: blur(8px);
  transform: scale(1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.quote-card:hover {
  transform: scale(1.05);
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}`}</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
};
