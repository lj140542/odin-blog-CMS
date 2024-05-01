import { ActionFunctionArgs, redirect, redirectDocument } from "react-router-dom";

export async function action({ params }: ActionFunctionArgs) {
  /*
    {
      "result": "done"
    }
  */
  const result = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params._id}`, { mode: "cors", method: "DELETE", credentials: "include", })
    .then(response => {
      if (response.ok) return response.json();
      else return response;
    })
    .catch(error => {
      console.error(error);
      return error;
    })

  if (result.result) return redirect('/');
  else if (result.status && result.status == 403) return redirectDocument('/');
  else throw new Error(result.status ? `${result.status} ${result.statusText}` : result);
}