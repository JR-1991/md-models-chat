import KnowledgeGraph from './knowledge-graph'
import { KnowledgeTriplet } from './types'

export default function Example() {
  const triplets: KnowledgeTriplet[] = [
    { subject: 'React', predicate: 'is built by', object: 'Facebook' },
    { subject: 'React', predicate: 'is written in', object: 'JavaScript' },
    { subject: 'JavaScript', predicate: 'runs in', object: 'Browser' },
    { subject: 'TypeScript', predicate: 'extends', object: 'JavaScript' },
    { subject: 'Next.js', predicate: 'is built on', object: 'React' },
  ]

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4 text-[#c9d1d9]">Directed Knowledge Graph</h1>
      <KnowledgeGraph triplets={triplets} />
    </div>
  )
}

