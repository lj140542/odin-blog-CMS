import { ActionFunctionArgs, redirect, redirectDocument } from "react-router-dom";

export async function action({ params }: ActionFunctionArgs) {
  /*
    {
      "result": "done",
      "published": true/false,
      "url": "/posts/6604394b10e46a327e4ff64c"
    }
  */
  const result = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params._id}/${params._publish}`, { mode: "cors", method: "PUT", credentials: "include", })
    .then(response => {
      if (response.ok) return response.json();
      else return response;
    })
    .catch(error => {
      console.error(error);
      return error;
    })

  if (result.url) return redirect(result.url);
  else if (result.status && result.status == 403) return redirectDocument('/');
  else throw new Error(result.status ? `${result.status} ${result.statusText}` : result);
}