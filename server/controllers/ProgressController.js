import pool from '../config/db.js';
import ProgressResource from '../resources/ProgressResource.js';

class ProgressController {
  /**
   * Get user's progress across all modules
   * GET /api/user/progress
   */
  static async getUserProgress(req, res) {
    try {
      // Validate user authentication
      const authValidation = ProgressResource.validateUserAuthentication(req.user);
      if (!authValidation.isValid) {
        return res.status(401).json({
          error: true,
          message: authValidation.error,
          code: 'NOT_AUTHENTICATED'
        });
      }

      const userId = req.user.id;

      // Fetch user's module progress
      const progressQuery = `
        SELECT module_id, is_completed
        FROM user_module_progress
        WHERE user_id = $1
        ORDER BY module_id
      `;
      const progressResult = await pool.query(progressQuery, [userId]);

      // Fetch user's project submissions
      const projectsQuery = `
        SELECT module_id, github_url
        FROM user_projects
        WHERE user_id = $1
        ORDER BY module_id
      `;
      const projectsResult = await pool.query(projectsQuery, [userId]);

      // Format and return response
      const response = ProgressResource.formatProgressResponse(
        progressResult.rows,
        projectsResult.rows
      );

      res.json(response);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to fetch user progress',
        code: 'PROGRESS_FETCH_ERROR'
      });
    }
  }

  /**
   * Mark a module as complete
   * POST /api/progress/module/:moduleId
   */
  static async markModuleComplete(req, res) {
    try {
      // Validate user authentication
      const authValidation = ProgressResource.validateUserAuthentication(req.user);
      if (!authValidation.isValid) {
        return res.status(401).json({
          error: true,
          message: authValidation.error,
          code: 'NOT_AUTHENTICATED'
        });
      }

      // Validate module ID
      const moduleValidation = ProgressResource.validateModuleId(req.params.moduleId);
      if (!moduleValidation.isValid) {
        return res.status(400).json({
          error: true,
          message: moduleValidation.error,
          code: 'INVALID_MODULE_ID'
        });
      }

      const userId = req.user.id;
      const moduleId = moduleValidation.moduleId;

      // Check if module exists
      const moduleCheckQuery = 'SELECT id FROM modules WHERE id = $1';
      const moduleCheckResult = await pool.query(moduleCheckQuery, [moduleId]);

      if (moduleCheckResult.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Module not found',
          code: 'MODULE_NOT_FOUND'
        });
      }

      // Insert or update progress record (UPSERT)
      const upsertQuery = `
        INSERT INTO user_module_progress (user_id, module_id, is_completed)
        VALUES ($1, $2, true)
        ON CONFLICT (user_id, module_id)
        DO UPDATE SET is_completed = true
        RETURNING *
      `;
      await pool.query(upsertQuery, [userId, moduleId]);

      // Return success response
      const response = ProgressResource.formatCompletionResponse(moduleId);
      res.json(response);
    } catch (error) {
      console.error('Error marking module complete:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to mark module as complete',
        code: 'PROGRESS_UPDATE_ERROR'
      });
    }
  }
}

export default ProgressController;
