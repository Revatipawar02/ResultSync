const API_BASE_URL =
  "http://localhost:8080/api/faculty/results";

/*
 * Get all semesters available in database
 */
export const getFacultySemesters = async () => {
  const response = await fetch(
    `${API_BASE_URL}/semesters`,
    {
      method: "GET",
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.message || "Unable to fetch semesters"
    );
  }

  return data;
};


/*
 * Get classes according to selected semester
 */
export const getFacultyClasses = async (semester) => {
  if (!semester) {
    return [];
  }

  const response = await fetch(
    `${API_BASE_URL}/classes?semester=${encodeURIComponent(
      semester
    )}`,
    {
      method: "GET",
    }
  );

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.message || "Unable to fetch classes"
    );
  }

  return data;
};


/*
 * Get filtered results
 */
export const getFacultyResults = async (
  studentClass,
  semester
) => {
  if (!studentClass || !semester) {
    return [];
  }

  const url =
    `${API_BASE_URL}` +
    `?studentClass=${encodeURIComponent(studentClass)}` +
    `&semester=${encodeURIComponent(semester)}`;

  const response = await fetch(url);

  const contentType =
    response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.message || "Unable to fetch student results"
    );
  }

  return data;
};


/*
 * Download generated Excel
 */
export const downloadFacultyExcel = async (
  studentClass,
  semester
) => {
  if (!studentClass || !semester) {
    throw new Error(
      "Please select class and semester"
    );
  }

  const url =
    `${API_BASE_URL}/download-excel` +
    `?studentClass=${encodeURIComponent(studentClass)}` +
    `&semester=${encodeURIComponent(semester)}`;

  const response = await fetch(url);

  if (!response.ok) {
    const contentType =
      response.headers.get("content-type") || "";

    let errorMessage =
      "Unable to download Excel file";

    if (contentType.includes("application/json")) {
      const data = await response.json();

      errorMessage =
        typeof data === "string"
          ? data
          : data.message || errorMessage;
    } else {
      const text = await response.text();

      if (text) {
        errorMessage = text;
      }
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();

  const disposition =
    response.headers.get("Content-Disposition");

  let fileName =
    `Student_Results_${studentClass}_${semester}.xlsx`;

  if (disposition) {
    const match =
      disposition.match(/filename="([^"]+)"/);

    if (match && match[1]) {
      fileName = match[1];
    }
  }

  const blobUrl =
    window.URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;

  document.body.appendChild(link);

  link.click();

  link.remove();

  window.URL.revokeObjectURL(blobUrl);

  return true;
};