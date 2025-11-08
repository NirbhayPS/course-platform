import { useState } from 'react'

function ProjectSubmissionComponent({ moduleId, existingUrl }) {
  const [githubUrl, setGithubUrl] = useState(existingUrl || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous messages
    setMessage(null)
    setError(null)

    // Basic validation
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL')
      return
    }

    // Validate GitHub URL format
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/.+/i
    if (!githubUrlPattern.test(githubUrl.trim())) {
      setError('Please enter a valid GitHub URL (e.g., https://github.com/username/repo)')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/project/module/${moduleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ githubUrl: githubUrl.trim() })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit project')
      }

      // Show success message
      setMessage(data.message || 'Project submitted successfully!')
      
    } catch (err) {
      console.error('Error submitting project:', err)
      setError(err.message || 'Failed to submit project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <span className="text-2xl">📁</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900">
          Submit Your Project
        </h3>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        Share your GitHub repository URL for this module's project. You can update it anytime.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="githubUrl" className="block text-sm font-semibold text-gray-700 mb-2">
            GitHub Repository URL
          </label>
          <div className="relative">
            <input
              type="text"
              id="githubUrl"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base"
              disabled={isSubmitting}
            />
            {githubUrl && (
              <button
                type="button"
                onClick={() => setGithubUrl('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="font-semibold mb-1">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {message && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-lg shadow-sm animate-slideIn">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Success!</p>
                <p className="text-sm">{message}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-4 rounded-lg font-semibold transition-all duration-300 transform ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </span>
          ) : (
            existingUrl ? 'Update Project' : 'Submit Project'
          )}
        </button>
      </form>
    </div>
  )
}

export default ProjectSubmissionComponent
