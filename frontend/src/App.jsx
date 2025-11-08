import { useState } from 'react'
import './index.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-4xl font-bold text-red-600">Tailwind v4 is live</h1>
    </>
  )
}

export default App
