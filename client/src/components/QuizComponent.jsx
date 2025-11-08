import { useState } from 'react'
import AnswerOption from './AnswerOption'

function QuizComponent({ question }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleAnswerSelect = async (answerId) => {
    if (selectedAnswer !== null) {
      // Already submitted, don't allow resubmission
      return
    }

    setIsSubmitting(true)
    setSelectedAnswer(answerId)
    setError(null)

    try {
      const response = await fetch(`/api/quiz/submit/${answerId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to submit answer')
      }

      const result = await response.json()
      setFeedback(result)
    } catch (error) {
      console.error('Error submitting answer:', error)
      // Reset on error to allow retry
      setSelectedAnswer(null)
      setError('Failed to submit answer. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-2 border-gray-200 rounded-xl p-5 sm:p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm hover:shadow-md transition-all duration-300">
      {/* Question scenario */}
      {question.scenario && (
        <div className="mb-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-xl flex-shrink-0">💡</span>
            <p className="text-sm sm:text-base text-gray-700 italic leading-relaxed">{question.scenario}</p>
          </div>
        </div>
      )}
      
      {/* Question text */}
      <h5 className="font-bold text-gray-900 mb-5 text-base sm:text-lg leading-snug">
        {question.question_text}
      </h5>

      {/* Answer options */}
      <div className="space-y-3">
        {question.answers && question.answers.map((answer) => (
          <AnswerOption
            key={answer.id}
            answer={answer}
            isSelected={selectedAnswer === answer.id}
            isDisabled={selectedAnswer !== null}
            isSubmitting={isSubmitting}
            onSelect={() => handleAnswerSelect(answer.id)}
          />
        ))}
      </div>

      {/* Loading indicator */}
      {isSubmitting && !feedback && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm font-medium">Checking your answer...</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 animate-slideIn">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl flex-shrink-0">⚠️</span>
            <div>
              <p className="font-semibold text-red-800 mb-1">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback section */}
      {feedback && (
        <div
          className={`mt-5 p-5 rounded-xl border-l-4 shadow-sm animate-slideIn ${
            feedback.correct
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-500'
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              feedback.correct ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white text-xl font-bold">
                {feedback.correct ? '✓' : '✗'}
              </span>
            </div>
            <div className="flex-1">
              <p className={`font-bold mb-2 text-lg ${
                feedback.correct ? 'text-green-800' : 'text-red-800'
              }`}>
                {feedback.correct ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                {feedback.explanation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizComponent
