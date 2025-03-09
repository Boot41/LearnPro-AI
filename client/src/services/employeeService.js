import { get, post, del } from './apiService';

/**
 * Get list of all employees
 * @returns {Promise} Promise resolving to employee data
 */
export const getEmployees = async () => {
  try {
    const response = await get('/api/users/employees');
    return response;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

/**
 * Add a new employee
 * @param {Object} employeeData - Employee data including name, email, and project
 * @returns {Promise} Promise resolving to the created employee data
 */
export const addEmployee = async (employeeData) => {
  try {
    const response = await post('/api/register', {
      email: employeeData.email,
      password: 'employee123', // Default password
      first_name: employeeData.first_name,
      last_name: employeeData.last_name,
      user_type: 'employee'
    });

    // If project is selected, assign it to the employee
    if (employeeData.project_id) {
      await assignProjectToEmployee(employeeData.email, employeeData.project_id);
    }

    return response;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

/**
 * Assign a project to an employee
 * @param {string} email - Employee's email
 * @param {number} projectId - Project ID to assign
 * @returns {Promise} Promise resolving to the assignment result
 */
export const assignProjectToEmployee = async (email, projectId) => {
  try {
    const response = await post('/api/users/assign-project', {
      email,
      project_id: parseInt(projectId)
    });
    return response;
  } catch (error) {
    console.error('Error assigning project:', error);
    throw error;
  }
};

/**
 * Delete learning path and unassign project from an employee
 * @param {number} employeeId - Employee's ID
 * @returns {Promise} Promise resolving to the deletion result
 */
export const deleteLearningPathAndUnassignProject = async (employeeId) => {
  try {
    const response = await del(`/api/users/${employeeId}/learning_path`);
    return response;
  } catch (error) {
    console.error('Error deleting learning path and unassigning project:', error);
    throw error;
  }
};
