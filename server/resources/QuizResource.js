class QuizResource {
  /**
   * Validate answer ID parameter
   * Ensures the answer ID is a valid positive integer
   */
  static validateAnswerId(answerId) {
    const id = parseInt(answerId, 10);

    if (isNaN(id) || id <= 0) {
      return {
        isValid: false,
        error: 'Invalid answer ID. Must be a positive integer.'
      };
    }

    return {
      isValid: true,
      error: null,
      answerId: id
    };
  }

  /**
   * Format quiz submission response
   * Standardizes the response format for quiz answers
   */
  static formatQuizResponse(answerData) {
    if (!answerData) {
      return null;
    }

    return {
      correct: answerData.is_correct,
      explanation: answerData.explanation
    };
  }

  /**
   * Validate user authentication for quiz submission
   * Ensures user is logged in before submitting answers
   */
  static validateUserAuthentication(user) {
    if (!user || !user.id) {
      return {
        isValid: false,
        error: 'User must be authenticated to submit quiz answers'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }
}

export default QuizResource;
