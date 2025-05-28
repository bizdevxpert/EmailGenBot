import { FaEnvelope } from 'react-icons/fa'

function Header() {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaEnvelope className="text-2xl" />
            <h1 className="text-xl font-bold">Email Generator Tool</h1>
          </div>
          <div>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-100 hover:text-white text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
