interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

async function fetchData(
  url: string,
  options: RequestOptions = {}
): Promise<any> {
  const { method = "GET", headers = {}, body = null } = options;

  const config: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    // Include the body only for POST and PUT requests
    body:
      body !== null && (method === "POST" || method === "PUT")
        ? JSON.stringify(body)
        : null,
  };

  try {
    const response = await fetch(`/api/${url}`, config);
    const jsonResponse = await response.json();
    if (!response.ok) {
      throw jsonResponse.error || "Request failed";
    }
    return jsonResponse;
  } catch (error: any) {
    console.error("Error:", error);
    throw error;
  }
}

export default fetchData;
