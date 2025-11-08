import QuizComponent from './QuizComponent'

function CheckpointComponent({ checkpoint }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 animate-fadeIn">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg">
            {checkpoint.checkpoint_number}
          </span>
        </div>
        <div className="flex-1 w-full">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {checkpoint.title}
          </h3>
          
          {/* Render content with proper HTML rendering */}
          <div 
            className="text-gray-700 leading-relaxed prose prose-lg max-w-none mb-6 prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: checkpoint.content }}
          />
          
          {/* Render quiz questions if they exist */}
          {checkpoint.questions && checkpoint.questions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl">📝</span>
                <h4 className="text-xl font-bold text-gray-900">
                  Quiz Questions
                </h4>
              </div>
              <div className="space-y-6">
                {checkpoint.questions.map((question) => (
                  <QuizComponent key={question.id} question={question} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckpointComponent
