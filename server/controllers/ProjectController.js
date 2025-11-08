import pool from '../config/db.js';
import ProjectResource from '../resources/ProjectResource.js';

class ProjectController {
  /**
   * Submit or update a project for a module
   * POST /api/project/module/:moduleId
   */
  static async submitProject(req, res) {
    try {
      // Validate user authentication
      const authValidation = ProjectResource.validateUserAuthentication(req.user);
      if (!authValidation.isValid) {
        return res.status(401).json({
          error: true,
          message: authValidation.error,
          code: 'NOT_AUTHENTICATED'
        });
      }

      // Validate request body
      const bodyValidation = ProjectResource.validateProjectSubmission(req.body);
      if (!bodyValidation.isValid) {
        return res.status(400).json({
          error: true,
          message: bodyValidation.error,
          code: 'INVALID_REQUEST_BODY'
        });
      }

      // Validate module ID
      const moduleValidation = ProjectResource.validateModuleId(req.params.moduleId);
      if (!moduleValidation.isValid) {
        return res.status(400).json({
          error: true,
          message: moduleValidation.error,
          code: 'INVALID_MODULE_ID'
        });
      }

      // Validate GitHub URL
      const urlValidation = ProjectResource.validateGithubUrl(req.body.githubUrl);
      if (!urlValidation.isValid) {
        return res.status(400).json({
          error: true,
          message: urlValidation.error,
          code: 'INVALID_GITHUB_URL'
        });
      }

      const userId = req.user.id;
      const moduleId = moduleValidation.moduleId;
      const githubUrl = urlValidation.githubUrl;

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

      // Check if project already exists for this user and module
      const existingProjectQuery = `
        SELECT id FROM user_projects
        WHERE user_id = $1 AND module_id = $2
      `;
      const existingProjectResult = await pool.query(existingProjectQuery, [userId, moduleId]);
      const isUpdate = existingProjectResult.rows.length > 0;

      // Insert or update project submission (UPSERT)
      const upsertQuery = `
        INSERT INTO user_projects (user_id, module_id, github_url)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, module_id)
        DO UPDATE SET github_url = $3
        RETURNING *
      `;
      await pool.query(upsertQuery, [userId, moduleId, githubUrl]);

      // Return success response
      const response = ProjectResource.formatSubmissionResponse(moduleId, githubUrl, isUpdate);
      res.json(response);
    } catch (error) {
      console.error('Error submitting project:', error);
      res.status(500).json({
        error: true,
        message: 'Failed to submit project',
        code: 'PROJECT_SUBMISSION_ERROR'
      });
    }
  }
}

export default ProjectController;
