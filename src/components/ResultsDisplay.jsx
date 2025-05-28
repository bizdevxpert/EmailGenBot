import { useState } from 'react'
import { FaDownload, FaCopy, FaCheck } from 'react-icons/fa'
import Papa from 'papaparse'
import { toast } from 'react-toastify'

function ResultsDisplay({ results }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  
  const flattenResults = () => {
    // Flatten the results for CSV export
    const flattenedData = []
    
    results.forEach(person => {
      person.emailCombinations.forEach(email => {
        flattenedData.push({
          firstName: person.firstName,
          lastName: person.lastName,
          companyName: person.companyName,
          jobTitle: person.jobTitle || '',
          emailPattern: email.pattern,
          emailAddress: email.email
        })
      })
    })
    
    return flattenedData
  }
  
  const handleDownloadCSV = () => {
    const flattenedData = flattenResults()
    const csv = Papa.unparse(flattenedData)
    
    // Create a blob and download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'email_combinations.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  const handleCopyAll = () => {
    const flattenedData = flattenResults()
    const textToCopy = flattenedData.map(row => 
      `${row.firstName},${row.lastName},${row.companyName},${row.jobTitle},${row.emailPattern},${row.emailAddress}`
    ).join('\n')
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success('All results copied to clipboard')
      })
      .catch(() => {
        toast.error('Failed to copy results')
      })
  }
  
  const handleCopyEmail = (email, index) => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      })
      .catch(() => {
        toast.error('Failed to copy email')
      })
  }
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Results ({results.reduce((acc, person) => acc + person.emailCombinations.length, 0)} email combinations)
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={handleCopyAll}
            className="btn btn-secondary flex items-center text-sm"
          >
            <FaCopy className="mr-1" />
            Copy All
          </button>
          <button 
            onClick={handleDownloadCSV}
            className="btn btn-primary flex items-center text-sm"
          >
            <FaDownload className="mr-1" />
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {results.map((person, personIndex) => (
          <div key={personIndex} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium">
                {person.firstName} {person.lastName} - {person.companyName}
                {person.jobTitle && ` (${person.jobTitle})`}
              </h3>
            </div>
            
            <div className="divide-y">
              {person.emailCombinations.map((combo, comboIndex) => {
                const globalIndex = `${personIndex}-${comboIndex}`
                return (
                  <div key={comboIndex} className="px-4 py-2 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-sm">{combo.email}</div>
                      <div className="text-xs text-gray-500">{combo.pattern}</div>
                    </div>
                    <button
                      onClick={() => handleCopyEmail(combo.email, globalIndex)}
                      className="text-gray-500 hover:text-indigo-600 p-1"
                      title="Copy email"
                    >
                      {copiedIndex === globalIndex ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaCopy />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ResultsDisplay
