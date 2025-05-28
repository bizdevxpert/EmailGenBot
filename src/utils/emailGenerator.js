/**
 * Generates all possible email combinations for a person
 * @param {string} firstName - The person's first name
 * @param {string} lastName - The person's last name
 * @param {string} companyName - The company domain (without @)
 * @param {string} jobTitle - Optional job title
 * @returns {Array} Array of email combinations with pattern descriptions
 */
export function generateEmailCombinations(firstName, lastName, companyName, jobTitle = '') {
  // Normalize inputs
  firstName = firstName.trim().toLowerCase()
  lastName = lastName.trim().toLowerCase()
  
  // Extract domain from company name if needed
  let domain = companyName.trim().toLowerCase()
  
  // If company name contains spaces, convert to domain format
  if (domain.includes(' ')) {
    domain = domain.replace(/\s+/g, '')
  }
  
  // Add .com if no extension exists
  if (!domain.includes('.')) {
    domain += '.com'
  }
  
  // Get first initial and last initial
  const firstInitial = firstName.charAt(0)
  const lastInitial = lastName.charAt(0)
  
  // Common email patterns
  const patterns = [
    {
      pattern: 'first.last@company',
      email: `${firstName}.${lastName}@${domain}`
    },
    {
      pattern: 'firstlast@company',
      email: `${firstName}${lastName}@${domain}`
    },
    {
      pattern: 'first@company',
      email: `${firstName}@${domain}`
    },
    {
      pattern: 'f.last@company',
      email: `${firstInitial}.${lastName}@${domain}`
    },
    {
      pattern: 'flast@company',
      email: `${firstInitial}${lastName}@${domain}`
    },
    {
      pattern: 'last.first@company',
      email: `${lastName}.${firstName}@${domain}`
    },
    {
      pattern: 'lastfirst@company',
      email: `${lastName}${firstName}@${domain}`
    },
    {
      pattern: 'last.f@company',
      email: `${lastName}.${firstInitial}@${domain}`
    },
    {
      pattern: 'lastf@company',
      email: `${lastName}${firstInitial}@${domain}`
    },
    {
      pattern: 'last@company',
      email: `${lastName}@${domain}`
    },
    {
      pattern: 'first_last@company',
      email: `${firstName}_${lastName}@${domain}`
    },
    {
      pattern: 'f_last@company',
      email: `${firstInitial}_${lastName}@${domain}`
    },
    {
      pattern: 'first-last@company',
      email: `${firstName}-${lastName}@${domain}`
    },
    {
      pattern: 'f-last@company',
      email: `${firstInitial}-${lastName}@${domain}`
    }
  ]
  
  // Add job title based patterns if job title is provided
  if (jobTitle && jobTitle.trim() !== '') {
    const normalizedJobTitle = jobTitle.trim().toLowerCase().replace(/\s+/g, '')
    
    patterns.push(
      {
        pattern: 'jobtitle@company',
        email: `${normalizedJobTitle}@${domain}`
      },
      {
        pattern: 'first.jobtitle@company',
        email: `${firstName}.${normalizedJobTitle}@${domain}`
      },
      {
        pattern: 'f.jobtitle@company',
        email: `${firstInitial}.${normalizedJobTitle}@${domain}`
      }
    )
  }
  
  return patterns
}
