// apiCall/auth.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://apis.manuscripthq.com/api";

export const Login = async (email, password) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("email", email);
  urlencoded.append("password", password);

  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
};

export const Register = async (firstName, lastName, email, password, couponCode) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("firstName", firstName);
  urlencoded.append("lastName", lastName);
  urlencoded.append("email", email);
  urlencoded.append("password", password);
  if (couponCode === "WRITER25") {
    urlencoded.append("subscription", "Premium");
    urlencoded.append("couponCode", "WRITER25");
  }

  const response = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }

  return await response.json();
};

export const createManuscript = async (data, token) => {
  const payload = {
    ...data,
    targetCount: Number(data.targetCount),
  };

  const response = await fetch(`${API_BASE_URL}/manuscript/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMessage = "Failed to create manuscript";
    try {
      const errorData = await response.json();
      if (errorData.message) errorMessage = errorData.message;
    } catch (err) {}
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const sendForgetPasswordEmail = async (email) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("email", email);

  const response = await fetch(`${API_BASE_URL}/user/forgotPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error response text:", text);
    let errorMessage = "Failed to send reset link";
    try {
      const errorData = JSON.parse(text);
      if (errorData.message) errorMessage = errorData.message;
    } catch {}

    throw new Error(errorMessage);
  }
  return await response.json();
};

export const resetPassword = async (password, token) => {
  const urlencoded = new URLSearchParams();
  urlencoded.append("password", password);

  try {
    const response = await fetch(`${API_BASE_URL}/user/changePassword`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "auth-token": token, // your auth token here
      },
      body: urlencoded.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Password reset failed");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || "Failed to reset password");
  }
};

export const updateUserDetails = async (userDetails, token) => {
  const myHeaders = new Headers();
  myHeaders.append("auth-token", token);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(userDetails);

  const requestOptions = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${API_BASE_URL}/user/updateUser`, requestOptions);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "User update failed");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw new Error("Failed to update user details");
  }
};

export const fetchManuscripts = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manuscript/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "auth-token": token,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching manuscripts:", error);
    throw new Error("Failed to fetch manuscripts.");
  }
};

export async function updatePassword({ oldPassword, newPassword, token }) {
  try {
    const response = await fetch(`${API_BASE_URL}/user/updatePassword`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();
    return data;
  } catch (err) {
    return { status: "error", message: err.message || "Network error" };
  }
}

export async function getAllTutorials() {
  const res = await fetch(`${API_BASE_URL}/videotutorial/getall`);
  if (!res.ok) throw new Error("Failed to fetch tutorials");
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export const fetchManuscriptDetails = async (manuscriptId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manuscript/get/manuscript/${manuscriptId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      throw new Error("Failed to fetch manuscript.");
    }
  } catch (error) {
    throw new Error("Error fetching manuscript.");
  }
};

const fetchAllCategories = async (token, user) => {
  if (!token) return [];

  try {
    const response = await fetch(`${API_BASE_URL}/checklistCategory/checklist/categories-tasks/${user.selectedManuscript._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    const result = await response.json();
    if (result.status === "success" && Array.isArray(result.data)) {
      return result.data.map((category) => ({
        id: category.checklistCategory._id,
        title: category.checklistCategory.title,
        checklist: category.checklistTasks.map((task) => ({
          id: task._id,
          title: task.title,
          subtitle: task.description || null,
          completed: task.isCompleted,
          isProOnly: task.isProOnly,
        })),
        counts: {
          total: category.counts.total,
          completed: category.counts.completed,
          pending: category.counts.pending,
        },
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchCategoryDetails = async (token, user, categoryId) => {
  if (!token || !categoryId || !user?.selectedManuscript._id)
    return { title: "", tasks: [] };

  try {
    const response = await fetch(`${API_BASE_URL}/checklistCategory/withtasks/${categoryId}/${user.selectedManuscript._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    const result = await response.json();
    if (result.status === "success" && result.data) {
      return {
        title: result.data.title || "",
        tasks: result.data.checklistTasks.map((task) => ({
          id: task._id,
          title: task.title,
          description: task.description,
          completed: task.isCompleted,
          isProOnly: task.isProOnly || false,
        })),
      };
    } else {
      return { title: "", tasks: [] };
    }
  } catch (error) {
    console.error("Error fetching category details:", error);
    return { title: "", tasks: [] };
  }
};

export { fetchAllCategories, fetchCategoryDetails };

export const fetchManuscriptTree = async (manuscriptId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/section/get/tree?manuscriptId=${manuscriptId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return {
        manuscript: data.data.manuscript,
        sections: data.data.sections || [],
        success: true,
      };
    } else {
      console.error(data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error fetching manuscript tree:", error);
    return { success: false, message: "Error fetching data." };
  }
};

export const fetchTaskDetails = async ({ id, token, manuscriptId }) => {
  const response = await fetch(`${API_BASE_URL}/checklisttask/get/task/${id}/${manuscriptId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });
  return response.json();
};

export const toggleTaskComplete = async ({
  userId,
  manuscriptId,
  checklistTaskId,
  token,
}) => {
  const response = await fetch(`${API_BASE_URL}/userchecklist/toggle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
    body: JSON.stringify({
      userId,
      manuscriptId,
      checklistTaskId,
    }),
  });
  return response.json();
};

export const fetchSelectedManuscript = async (manuscriptId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/manuscript/get/manuscript/${manuscriptId}`, {
      method: "GET",
      headers: {
        "auth-token": token,
      },
    });

    const result = await response.json();

    if (result.status === "success") {
      return result.data;
    } else {
      console.error(result?.message || "Failed to fetch manuscript.");
    }
  } catch (error) {
    console.error("Error in fetchSelectedManuscript:", error);
    throw error;
  }
};

export const deleteManuscript = async (manuscriptId, token) => {
  const response = await fetch(`${API_BASE_URL}/manuscript/delete/${manuscriptId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": token,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete manuscript");
  }

  return response.json();
};

export const fetchManuscriptData = async (user, token) => {
  if (!user?.selectedManuscript._id || !token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/editor/all-content?manuscriptId=${user.selectedManuscript._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });

    const data = await response.json();
    if (data.status === "success") {
      return data;
    } else {
      throw new Error("Failed to load manuscript data");
    }
  } catch (error) {
    throw new Error("Failed to load manuscript data");
  }
};

export const updateManuscriptData = async (user, token, metadata) => {
  if (!user?.selectedManuscript || !token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/manuscript/update/${user.selectedManuscript._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(metadata),
    });

    const data = await response.json();
    if (data.status === "success") {
      return true;
    } else {
      throw new Error(data.message || "Failed to update manuscript");
    }
  } catch (error) {
    throw new Error("Failed to update manuscript");
  }
};

export const updateManuscriptDataByManuscriptId = async (
  user,
  token,
  metadata,
  manuscriptId
) => {
  if (!user?.selectedManuscript || !token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/manuscript/update/${manuscriptId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify(metadata),
    });

    const data = await response.json();
    if (data.status === "success") {
      return true;
    } else {
      throw new Error(data.message || "Failed to update manuscript");
    }
  } catch (error) {
    throw new Error("Failed to update manuscript");
  }
};
