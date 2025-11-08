class ProgressResource {
  /**
   * Validate module ID parameter
   * Ensures the module ID is a valid positive integer
   */
  static validateModuleId(moduleId) {
    const id = parseInt(moduleId, 10);

    if (isNaN(id) || id <= 0) {
      return {
        isValid: false,
        error: 'Invalid module ID. Must be a positive integer.'
      };
    }

    return {
      isValid: true,
      error: null,
      moduleId: id
    };
  }

  /**
   * Validate user authentication for progress operations
   * Ensures user is logged in before tracking progress
   */
  static validateUserAuthentication(user) {
    if (!user || !user.id) {
      return {
        isValid: false,
        error: 'User must be authenticated to track progress'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Format user progress response
   * Standardizes the response format for progress data
   */
  static formatProgressResponse(progressData, projectsData) {
    return {
      progress: progressData.map(item => ({
        moduleId: item.module_id,
        isCompleted: item.is_completed
      })),
      projects: projectsData.map(item => ({
        moduleId: item.module_id,
        githubUrl: item.github_url
      }))
    };
  }

  /**
   * Format module completion response
   * Standardizes the response format for marking module complete
   */
  static formatCompletionResponse(moduleId) {
    return {
      success: true,
      message: 'Module marked as complete',
      moduleId: moduleId
    };
  }
}

export default ProgressResource;
