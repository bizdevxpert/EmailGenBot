import { useState } from 'react'
import { FaUpload, FaSpinner, FaFileAlt, FaClipboard } from 'react-icons/fa'
import Papa from 'papaparse'
import { toast } from 'react-toastify'

function BulkEntryForm({ onSubmit, isLoading }) {
  const [fileData, setFileData] = useState(null)
  const [fileName, setFileName] = useState('')
  const [textAreaValue, setTextAreaValue] = useState('')
  const [inputMethod, setInputMethod] = useState('file')

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
      
      // Check if it's a CSV file
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        toast.error('Please upload a CSV file')
        return
      }
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (validateData(results.data)) {
            setFileData(results.data)
          }
        },
        error: () => {
          toast.error('Error parsing CSV file')
        }
      })
    }
  }

  const handleTextAreaChange = (e) => {
    setTextAreaValue(e.target.value)
  }

  const handlePaste = () => {
    // Parse the pasted data
    Papa.parse(textAreaValue, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (validateData(results.data)) {
          setFileData(results.data)
        }
      },
      error: () => {
        toast.error('Error parsing pasted data')
      }
    })
  }

  const validateData = (data) => {
    // Check if data has required fields
    if (!data.length) {
      toast.error('No data found')
      return false
    }
    
    const missingFields = []
    
    // Check first record for required fields
    const firstRecord = data[0]
    if (!firstRecord.firstName && !firstRecord['First Name']) missingFields.push('First Name')
    if (!firstRecord.lastName && !firstRecord['Last Name']) missingFields.push('Last Name')
    if (!firstRecord.companyName && !firstRecord['Company Name']) missingFields.push('Company Name')
    
    if (missingFields.length) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`)
      return false
    }
    
    // Normalize field names
    const normalizedData = data.map(record => ({
      firstName: record.firstName || record['First Name'] || '',
      lastName: record.lastName || record['Last Name'] || '',
      companyName: record.companyName || record['Company Name'] || '',
      jobTitle: record.jobTitle || record['Job Title'] || ''
    }))
    
    return normalizedData
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!fileData) {
      if (inputMethod === 'paste' && textAreaValue) {
        handlePaste()
        return
      }
      toast.error('Please upload a CSV file or paste data first')
      return
    }
    
    onSubmit(fileData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-6">
        <div className="flex mb-4">
          <button
            type="button"
            className={`tab ${inputMethod === 'file' ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setInputMethod('file')}
          >
            Upload CSV
          </button>
          <button
            type="button"
            className={`tab ${inputMethod === 'paste' ? 'tab-active' : 'tab-inactive'}`}
            onClick={() => setInputMethod('paste')}
          >
            Paste Data
          </button>
        </div>
        
        {inputMethod === 'file' ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="csvFile"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="csvFile"
              className="cursor-pointer flex flex-col items-center justify-center"
            >
              <FaUpload className="text-3xl text-gray-400 mb-2" />
              <span className="text-gray-600 mb-2">
                {fileName || 'Click to upload CSV file'}
              </span>
              <span className="text-xs text-gray-500">
                CSV must include firstName, lastName, companyName columns
              </span>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <textarea
              className="input h-40 font-mono text-sm"
              placeholder="Paste CSV data here (including headers)..."
              value={textAreaValue}
              onChange={handleTextAreaChange}
            ></textarea>
            <div className="flex justify-end">
              <button
                type="button"
                className="btn btn-secondary flex items-center"
                onClick={handlePaste}
              >
                <FaClipboard className="mr-2" />
                Parse Pasted Data
              </button>
            </div>
          </div>
        )}
      </div>
      
      {fileData && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FaFileAlt className="mr-2" />
            <span>
              {fileData.length} {fileData.length === 1 ? 'record' : 'records'} loaded
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-2 py-1 text-left">First Name</th>
                  <th className="px-2 py-1 text-left">Last Name</th>
                  <th className="px-2 py-1 text-left">Company</th>
                  <th className="px-2 py-1 text-left">Job Title</th>
                </tr>
              </thead>
              <tbody>
                {fileData.slice(0, 3).map((row, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-2 py-1">{row.firstName}</td>
                    <td className="px-2 py-1">{row.lastName}</td>
                    <td className="px-2 py-1">{row.companyName}</td>
                    <td className="px-2 py-1">{row.jobTitle || '-'}</td>
                  </tr>
                ))}
                {fileData.length > 3 && (
                  <tr>
                    <td colSpan="4" className="px-2 py-1 text-center text-gray-500">
                      ... and {fileData.length - 3} more records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button 
          type="submit" 
          className="btn btn-primary flex items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Generate Emails'
          )}
        </button>
      </div>
    </form>
  )
}

export default BulkEntryForm
