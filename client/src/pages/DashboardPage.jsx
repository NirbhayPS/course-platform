import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function DashboardPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState([])
  const [progress, setProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
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
        setModules(courseData)
        
        // Fetch user progress
        const progressResponse = await fetch('/api/user/progress', {
          credentials: 'include'
        })
        
        if (!progressResponse.ok) {
          throw new Error('Failed to fetch progress')
        }
        
        const progressData = await progressResponse.json()
        setProgress(progressData.progress || [])
        
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const isModuleCompleted = (moduleId) => {
    return progress.some(p => p.module_id === moduleId && p.is_completed)
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
          <p className="mt-6 text-gray-700 font-medium text-lg">Loading your dashboard...</p>
          <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch your courses</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Dashboard</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-md hover:shadow-lg border border-gray-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          ML Engineer Course
        </h1>
        <p className="text-lg text-gray-600">
          Welcome back, {user?.display_name || 'Student'}! Continue your learning journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => {
          const completed = isModuleCompleted(module.id)
          
          return (
            <Link
              key={module.id}
              to={`/module/${module.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-300 transform hover:scale-105 animate-fadeIn"
            >
              <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                      Module {module.module_number}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {module.title}
                    </h2>
                  </div>
                  {completed && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-checkmark">
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
                    </div>
                  )}
                </div>
                
                {module.philosophy && (
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
                    {module.philosophy}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <span className="text-sm font-medium">
                      {module.checkpoints?.length || 0} checkpoints
                    </span>
                  </div>
                  {completed ? (
                    <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-blue-600 font-bold text-sm group-hover:gap-2 transition-all duration-300">
                      Start Learning
                      <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {modules.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📚</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Modules Yet</h3>
            <p className="text-gray-600 leading-relaxed">
              Course modules are being prepared. Check back soon to start your learning journey!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
