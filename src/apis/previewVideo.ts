import { devConfig, HOTSPRING_FRONTEND_URL } from "../config";

const headers = { "Content-Type": "application/json", Authorization: "" };
if (localStorage.getItem("access")) {
  headers.Authorization = `Bearer ${localStorage.getItem("access")}`;
}

export function getPreviewVideoListAPI(taskShotIds: string | null) {
  const HOTSPRING_API_REVIEW_TOOL = `${devConfig.API_HOST}/api/review_tool?taskShotIds=${taskShotIds}`;
  return fetch(`${HOTSPRING_API_REVIEW_TOOL}`)
    .then(response => response.json())
    .then(responseData => {
      return responseData.result;
    });
}
export async function createFeedbackNote(note: string | null) {
  const HOTSPRING_API_REVIEW_TOOL_CREATENOTE = `${devConfig.API_HOST}/api/review_tool/createfeedbacknote`;
  return (
    fetch(HOTSPRING_API_REVIEW_TOOL_CREATENOTE, {
      method: "POST",
      headers,
      body: note,
    })
      // eslint-disable-next-line no-return-await
      .then(r => r.json())
      .then(responseData => {
        return responseData;
      })
  );
}

export async function createSessionId(ott: string | null) {
  const HOTSPRING_API_REVIEW_TOOL_CREATESESSIONID = `${devConfig.API_HOST}/api/review_tool/createSessionId`;
  if (!localStorage.getItem("access")) {
    fetch(HOTSPRING_API_REVIEW_TOOL_CREATESESSIONID, {
      method: "POST",
      headers,
      body: JSON.stringify({ one_time_token: ott }),
    })
      // eslint-disable-next-line no-return-await
      .then(r => r.json())
      .then(responseData => {
        if (responseData.success) {
          localStorage.setItem("access", responseData.token.access);
          localStorage.setItem("refresh", responseData.token.refresh);
          // eslint-disable-next-line no-restricted-globals
          location.reload();
        }
        // eslint-disable-next-line no-console
        console.log(responseData.message);
        if (!localStorage.getItem("access")) {
          const params = new URLSearchParams(window.location.search);
          const taskShotIds = params.get("taskShotIds");
          window.location.href = `${HOTSPRING_FRONTEND_URL}/login?review_tool_redirect=${taskShotIds}`;
        }
      });
  }
}

export async function getPresignedURL(fileData: string | null) {
  const HOTSPRING_API_REVIEW_TOOL_PRESIGNEDURL = `${devConfig.API_HOST}/api/review_tool/generatesignedURL`;
  return (
    fetch(HOTSPRING_API_REVIEW_TOOL_PRESIGNEDURL, {
      method: "POST",
      headers,
      body: fileData,
    })
      // eslint-disable-next-line no-return-await
      .then(r => r.json())
      .then(responseData => {
        return responseData;
      })
  );
}
