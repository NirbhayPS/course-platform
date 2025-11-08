import { query } from '../config/db.js';

class CourseController {
  /**
   * Get all course content with nested structure
   * Returns modules with checkpoints, questions, and answers
   */
  static async getAllCourseContent(req, res) {
    try {
      // Single query with JOINs to fetch all course data efficiently
      const queryText = `
        SELECT 
          m.id as module_id,
          m.module_number,
          m.title as module_title,
          m.philosophy,
          m.description,
          c.id as checkpoint_id,
          c.checkpoint_number,
          c.title as checkpoint_title,
          c.content as checkpoint_content,
          q.id as question_id,
          q.question_text,
          q.scenario,
          a.id as answer_id,
          a.answer_text,
          a.explanation
        FROM modules m
        LEFT JOIN checkpoints c ON m.id = c.module_id
        LEFT JOIN questions q ON c.id = q.checkpoint_id
        LEFT JOIN answers a ON q.id = a.question_id
        ORDER BY m.module_number, c.checkpoint_number, q.id, a.id
      `;

      const result = await query(queryText);

      // Transform flat result into nested JSON structure
      const modulesMap = new Map();

      result.rows.forEach(row => {
        // Build module
        if (!modulesMap.has(row.module_id)) {
          modulesMap.set(row.module_id, {
            id: row.module_id,
            module_number: row.module_number,
            title: row.module_title,
            philosophy: row.philosophy,
            description: row.description,
            checkpoints: []
          });
        }

        const module = modulesMap.get(row.module_id);

        // Build checkpoint
        if (row.checkpoint_id) {
          let checkpoint = module.checkpoints.find(c => c.id === row.checkpoint_id);
          
          if (!checkpoint) {
            checkpoint = {
              id: row.checkpoint_id,
              checkpoint_number: row.checkpoint_number,
              title: row.checkpoint_title,
              content: row.checkpoint_content,
              questions: []
            };
            module.checkpoints.push(checkpoint);
          }

          // Build question
          if (row.question_id) {
            let question = checkpoint.questions.find(q => q.id === row.question_id);
            
            if (!question) {
              question = {
                id: row.question_id,
                question_text: row.question_text,
                scenario: row.scenario,
                answers: []
              };
              checkpoint.questions.push(question);
            }

            // Build answer (exclude is_correct field for client)
            if (row.answer_id) {
              const answerExists = question.answers.find(a => a.id === row.answer_id);
              
              if (!answerExists) {
                question.answers.push({
                  id: row.answer_id,
                  answer_text: row.answer_text,
                  explanation: row.explanation
                  // Note: is_correct is intentionally excluded from client response
                });
              }
            }
          }
        }
      });

      // Convert map to array
      const modules = Array.from(modulesMap.values());

      res.json({
        error: false,
        modules
      });

    } catch (error) {
      console.error('Get all course content error:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to retrieve course content',
        code: 'COURSE_CONTENT_ERROR'
      });
    }
  }
}

export default CourseController;
