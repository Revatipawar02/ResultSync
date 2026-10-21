const API_URL = "http://localhost:8080/api/students";

// ==========================
// STUDENT REGISTRATION
// ==========================
export const registerStudent = async (studentData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(studentData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : "Registration failed"
    );
  }

  return data;
};


// ==========================
// STUDENT LOGIN
// ==========================
export const loginStudent = async (loginValue, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginValue.trim(),
      password: password,
    }),
  });

  const responseText = await response.text();

  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    data = responseText;
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : "Invalid Email/PRN or Password"
    );
  }

  return data;
};


// ==========================
// GET STUDENT PROFILE
// ==========================
export const getStudentProfile = async (studentId) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || "Failed to load profile");
    }

    return await response.json();
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);
    throw error;
  }
};


// ==========================
// UPDATE STUDENT PROFILE
// ==========================
export const updateStudentProfile = async (
  studentId,
  studentData
) => {
  try {
    const response = await fetch(`${API_URL}/${studentId}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(studentData),
    });

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!response.ok) {
      throw new Error(
        typeof data === "string"
          ? data
          : "Failed to update profile"
      );
    }

    return data;

  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    throw error;
  }
};

