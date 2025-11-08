function AnswerOption({ answer, isSelected, isDisabled, isSubmitting, onSelect }) {
  const getButtonClasses = () => {
    const baseClasses = 'w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all duration-300 transform'
    
    if (isDisabled) {
      if (isSelected) {
        return `${baseClasses} bg-gradient-to-r from-blue-100 to-blue-50 border-blue-500 cursor-not-allowed shadow-md`
      }
      return `${baseClasses} bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed opacity-60`
    }
    
    return `${baseClasses} bg-white border-gray-300 hover:border-blue-500 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:scale-[1.02] cursor-pointer active:scale-[0.98]`
  }

  return (
    <button
      onClick={onSelect}
      disabled={isDisabled || isSubmitting}
      className={getButtonClasses()}
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          isSelected
            ? 'border-blue-500 bg-blue-500 shadow-lg scale-110'
            : 'border-gray-400 group-hover:border-blue-400'
        }`}>
          {isSelected && (
            <svg
              className="w-4 h-4 text-white animate-checkmark"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          )}
        </div>
        <span className={`flex-1 text-sm sm:text-base font-medium leading-snug ${
          isDisabled && !isSelected ? 'text-gray-500' : 'text-gray-900'
        }`}>
          {answer.answer_text}
        </span>
      </div>
    </button>
  )
}

export default AnswerOption
