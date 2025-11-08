class ProjectResource {
  /**
   * Validate GitHub URL
   * Ensures the URL is a valid GitHub repository URL
   */
  static validateGithubUrl(url) {
    if (!url || typeof url !== 'string') {
      return {
        isValid: false,
        error: 'GitHub URL is required'
      };
    }

    // Trim whitespace
    const trimmedUrl = url.trim();

    if (trimmedUrl.length === 0) {
      return {
        isValid: false,
        error: 'GitHub URL cannot be empty'
      };
    }

    // Check if URL is a valid GitHub URL
    const githubUrlPattern = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?.*$/i;
    
    if (!githubUrlPattern.test(trimmedUrl)) {
      return {
        isValid: false,
        error: 'Invalid GitHub URL. Must be a valid GitHub repository URL (e.g., https://github.com/username/repository)'
      };
    }

    return {
      isValid: true,
      error: null,
      githubUrl: trimmedUrl
    };
  }

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
   * Validate user authentication for project submission
   * Ensures user is logged in before submitting projects
   */
  static validateUserAuthentication(user) {
    if (!user || !user.id) {
      return {
        isValid: false,
        error: 'User must be authenticated to submit projects'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Validate project submission request body
   * Ensures the request contains required fields
   */
  static validateProjectSubmission(body) {
    if (!body || typeof body !== 'object') {
      return {
        isValid: false,
        error: 'Request body is required'
      };
    }

    if (!body.githubUrl) {
      return {
        isValid: false,
        error: 'githubUrl field is required in request body'
      };
    }

    return {
      isValid: true,
      error: null
    };
  }

  /**
   * Format project submission response
   * Standardizes the response format for successful submissions
   */
  static formatSubmissionResponse(moduleId, githubUrl, isUpdate = false) {
    return {
      success: true,
      message: isUpdate 
        ? 'Project submission updated successfully' 
        : 'Project submitted successfully',
      moduleId: moduleId,
      githubUrl: githubUrl
    };
  }
}

export default ProjectResource;
