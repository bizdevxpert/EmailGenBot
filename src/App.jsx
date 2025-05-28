import { useState } from 'react'
import SingleEntryForm from './components/SingleEntryForm'
import BulkEntryForm from './components/BulkEntryForm'
import ResultsDisplay from './components/ResultsDisplay'
import { generateEmailCombinations } from './utils/emailGenerator'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState('single')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSingleSubmit = (data) => {
    setIsLoading(true)
    
    // Generate email combinations for a single entry
    const combinations = generateEmailCombinations(
      data.firstName,
      data.lastName,
      data.companyName,
      data.jobTitle
    )
    
    setResults([{
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      emailCombinations: combinations
    }])
    
    setIsLoading(false)
  }

  const handleBulkSubmit = (dataArray) => {
    setIsLoading(true)
    
    // Generate email combinations for each entry in the array
    const processedResults = dataArray.map(data => {
      return {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        jobTitle: data.jobTitle || '',
        emailCombinations: generateEmailCombinations(
          data.firstName,
          data.lastName,
          data.companyName,
          data.jobTitle
        )
      }
    })
    
    setResults(processedResults)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="card mb-8">
            <div className="border-b mb-6">
              <div className="flex">
                <button 
                  className={`tab ${activeTab === 'single' ? 'tab-active' : 'tab-inactive'}`}
                  onClick={() => setActiveTab('single')}
                >
                  Single Entry
                </button>
                <button 
                  className={`tab ${activeTab === 'bulk' ? 'tab-active' : 'tab-inactive'}`}
                  onClick={() => setActiveTab('bulk')}
                >
                  Bulk Processing
                </button>
              </div>
            </div>
            
            {activeTab === 'single' ? (
              <SingleEntryForm onSubmit={handleSingleSubmit} isLoading={isLoading} />
            ) : (
              <BulkEntryForm onSubmit={handleBulkSubmit} isLoading={isLoading} />
            )}
          </div>
          
          {results.length > 0 && (
            <ResultsDisplay results={results} />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
