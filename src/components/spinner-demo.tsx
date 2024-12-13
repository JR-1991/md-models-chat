import React from 'react'
import { Spinner } from './ui/spinner'

export function SpinnerDemo() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold mb-8">Spinner Component Demo</h1>
      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Small</h2>
          <Spinner size="sm" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Medium</h2>
          <Spinner size="md" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Large</h2>
          <Spinner size="lg" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Primary</h2>
          <Spinner color="primary" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Secondary</h2>
          <Spinner color="secondary" />
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-4">Accent</h2>
          <Spinner color="accent" />
        </div>
      </div>
    </div>
  )
}

