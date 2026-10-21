const API_URL =
  "http://localhost:8080/api/results";

// =====================================================
// UPLOAD RESULT PDF
// =====================================================

export const uploadResult = async (
  file,
  studentClass,
  semester
) => {

  if (!file) {
    throw new Error("Result PDF is required");
  }

  if (!studentClass) {
    throw new Error("Class is required");
  }

  if (!semester) {
    throw new Error("Semester is required");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("studentClass", studentClass);
  formData.append("semester", semester);

  const response = await fetch(
    `${API_URL}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : data?.message ||
          "Result upload failed"
    );
  }

  return data;
};


// =====================================================
// GET ALL RESULTS OF STUDENT
// =====================================================

export const getStudentResults = async (
  studentId
) => {

  const response = await fetch(
    `${API_URL}/student/${studentId}`
  );

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : "Unable to fetch student results"
    );
  }

  return data;
};


// =====================================================
// GET SINGLE RESULT
// =====================================================

export const getResultById = async (
  resultId
) => {

  const response = await fetch(
    `${API_URL}/${resultId}`
  );

  const contentType =
    response.headers.get("content-type");

  let data;

  if (
    contentType &&
    contentType.includes("application/json")
  ) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {

    throw new Error(
      typeof data === "string"
        ? data
        : "Unable to fetch result"
    );
  }

  return data;
};


// =====================================================
// DOWNLOAD RESULT PDF
// =====================================================

export const downloadResultPdf = async (
  resultId
) => {

  const response = await fetch(
    `${API_URL}/${resultId}/download`
  );

  if (!response.ok) {

    const errorText =
      await response.text();

    throw new Error(
      errorText ||
      "Unable to download result PDF"
    );
  }

  const blob =
    await response.blob();

  const contentDisposition =
    response.headers.get(
      "Content-Disposition"
    );

  let fileName =
    `Result_${resultId}.pdf`;

  if (contentDisposition) {

    const match =
      contentDisposition.match(
        /filename="?([^"]+)"?/i
      );

    if (match && match[1]) {
      fileName = match[1];
    }
  }

  const url =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(url);
};