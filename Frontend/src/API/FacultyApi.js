const API_BASE_URL = "http://localhost:8080/api/faculty";

// ==========================================
// FACULTY LOGIN
// ==========================================

export const facultyLogin = async (email, password) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data.message || "Faculty login failed"
      );
    }

    return data;

  } catch (error) {
    console.error("Faculty Login Error:", error);

    throw error;
  }
};


// ==========================================
// GET FACULTY BY ID
// ==========================================

export const getFacultyById = async (facultyId) => {
  try {
    if (!facultyId) {
      throw new Error("Faculty ID is required");
    }

    const response = await fetch(
      `${API_BASE_URL}/${facultyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : data.message || "Unable to get faculty"
      );
    }

    return data;

  } catch (error) {
    console.error("Get Faculty Error:", error);

    throw error;
  }
};