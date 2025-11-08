import { query } from '../config/db.js';
import QuizResource from '../resources/QuizResource.js';

class QuizController {
  /**
   * Submit quiz answer and get immediate feedback
   * Validates the answer and returns whether it's correct with explanation
   */
  static async submitAnswer(req, res) {
    try {
      // Validate user authentication
      const authValidation = QuizResource.validateUserAuthentication(req.user);
      if (!authValidation.isValid) {
        return res.status(401).json({
          error: true,
          message: authValidation.error,
          code: 'NOT_AUTHENTICATED'
        });
      }

      // Validate answer ID from URL parameter
      const { answerId } = req.params;
      const validation = QuizResource.validateAnswerId(answerId);

      if (!validation.isValid) {
        return res.status(400).json({
          error: true,
          message: validation.error,
          code: 'INVALID_ANSWER_ID'
        });
      }

      // Query database for answer details
      const queryText = `
        SELECT 
          id,
          answer_text,
          is_correct,
          explanation
        FROM answers
        WHERE id = $1
      `;

      const result = await query(queryText, [validation.answerId]);

      // Check if answer exists
      if (result.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Answer not found',
          code: 'ANSWER_NOT_FOUND'
        });
      }

      const answerData = result.rows[0];

      // Format and return response
      const response = QuizResource.formatQuizResponse(answerData);

      res.json({
        error: false,
        ...response
      });

    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to submit quiz answer',
        code: 'QUIZ_SUBMISSION_ERROR'
      });
    }
  }
}

export default QuizController;
