import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import CheckpointComponent from '../components/CheckpointComponent'
import ProjectSubmissionComponent from '../components/ProjectSubmissionComponent'

function ModulePage() {
  const { moduleId } = useParams()
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [existingProjectUrl, setExistingProjectUrl] = useState(null)
  const [isMarkingComplete, setIsMarkingComplete] = useState(false)
  const [completionMessage, setCompletionMessage] = useState(null)

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        setLoading(true)
        
        // Fetch all course content
        const courseResponse = await fetch('/api/course/all', {
          credentials: 'include'
        })
        
        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course content')
        }
        
        const courseData = await courseResponse.json()
        
        // Find the specific module
        const foundModule = courseData.find(m => m.id === parseInt(moduleId))
        
        if (!foundModule) {
          throw new Error('Module not found')
        }
        
        setModule(foundModule)
        
        // Fetch user progress
        const progressResponse = await fetch('/api/user/progress', {
          credentials: 'include'
        })
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json()
          
          // Check if this module is completed
          const moduleProgress = progressData.progress?.find(
            p => p.module_id === parseInt(moduleId)
          )
          setIsCompleted(moduleProgress?.is_completed || false)
          
          // Check if user has submitted a project for this module
          const moduleProject = progressData.projects?.find(
            p => p.module_id === parseInt(moduleId)
          )
          setExistingProjectUrl(moduleProject?.github_url || null)
        }
        
      } catch (err) {
        console.error('Error fetching module data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchModuleData()
  }, [moduleId])

  const handleMarkComplete = async () => {
    setIsMarkingComplete(true)
    setCompletionMessage(null)

    try {
      const response = await fetch(`/api/progress/module/${moduleId}`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark module as complete')
      }

      // Update completion status
      setIsCompleted(true)
      setCompletionMessage(data.message || 'Module marked as complete!')
      
    } catch (err) {
      console.error('Error marking module complete:', err)
      setCompletionMessage(err.message || 'Failed to mark module as complete')
    } finally {
      setIsMarkingComplete(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse-slow"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading module content...</p>
          <p className="mt-2 text-gray-500 text-sm">Preparing your learning materials</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-rose-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Module</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300 inline-block"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl">🔍</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Module Not Found</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            The module you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-block"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb navigation */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Module header */}
      <div className="mb-8">
        <div className="text-sm font-semibold text-blue-600 mb-2">
          Module {module.module_number}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {module.title}
        </h1>
        
        {module.philosophy && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              {module.philosophy}
            </p>
          </div>
        )}
        
        {module.description && (
          <p className="text-gray-600 text-lg">
            {module.description}
          </p>
        )}
      </div>

      {/* Checkpoints list */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Checkpoints
        </h2>
        
        {module.checkpoints && module.checkpoints.length > 0 ? (
          <div className="space-y-4">
            {module.checkpoints.map((checkpoint) => (
              <CheckpointComponent key={checkpoint.id} checkpoint={checkpoint} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-600">
            No checkpoints available for this module yet.
          </div>
        )}
      </div>

      {/* Project submission section */}
      <div className="mt-8">
        <ProjectSubmissionComponent 
          moduleId={moduleId} 
          existingUrl={existingProjectUrl}
        />
      </div>

      {/* Module completion section */}
      <div className="mt-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎯</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Module Completion
          </h3>
        </div>
        
        {isCompleted ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <p className="font-bold text-green-800 text-lg mb-1">Congratulations!</p>
                <p className="text-green-700">You've completed this module. Keep up the great work!</p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Once you've finished all checkpoints and submitted your project, mark this module as complete to track your progress.
            </p>
            
            {completionMessage && (
              <div className={`mb-6 px-5 py-4 rounded-lg shadow-sm animate-slideIn ${
                completionMessage.includes('Failed') || completionMessage.includes('Error')
                  ? 'bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500'
                  : 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500'
              }`}>
                <div className="flex items-start gap-3">
                  <span className={`text-xl flex-shrink-0 ${
                    completionMessage.includes('Failed') || completionMessage.includes('Error')
                      ? 'text-red-500'
                      : 'text-green-500'
                  }`}>
                    {completionMessage.includes('Failed') || completionMessage.includes('Error') ? '⚠️' : '✓'}
                  </span>
                  <p className={`font-medium ${
                    completionMessage.includes('Failed') || completionMessage.includes('Error')
                      ? 'text-red-700'
                      : 'text-green-700'
                  }`}>
                    {completionMessage}
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleMarkComplete}
              disabled={isMarkingComplete}
              className={`w-full sm:w-auto px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform ${
                isMarkingComplete
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {isMarkingComplete ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Marking Complete...
                </span>
              ) : (
                'Mark as Complete'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ModulePage
