import LoadingShowcase from '@/components/LoadingShowcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loading Animations Showcase | Neural Nexus',
  description: 'Explore the various loading animations and transitions available in Neural Nexus',
};

export default function LoadingShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
              Neural Nexus Loading Animations
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Check out these fire loading animations that keep the vibes lit while your content loads. 
              Use them throughout your app for a smoother user experience.
            </p>
          </div>
          
          <LoadingShowcase />
        </div>
      </div>
    </div>
  )
} 