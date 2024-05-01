import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostWithComments } from "@/types";
import { useLoaderData, Form, useNavigate, ActionFunctionArgs, redirectDocument } from "react-router-dom";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  if (updates?.title && updates?.content) {
    /*
      {
        "result": "done",
        "url": "/posts/662a838bd2e39563b6ebaf61"
      }
    */
    const result = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params._id}`, {
      mode: "cors",
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(Object.fromEntries(formData)),
    })
      .then(response => {
        if (response.ok) return response.json();
        else return response;
      })
      .catch(error => {
        console.error(error);
        return error;
      })

    if (result.url) return redirectDocument(result.url);
    else if (result.status && result.status == 403) return redirectDocument('/');
    else throw new Error(result.status ? `${result.status} ${result.statusText}` : result);
  }

  return null;
}

export default function PostForm() {
  const { post } = useLoaderData() as PostWithComments;
  const navigate = useNavigate();

  return (
    <>
      {(post && (
        <Form method="post" id="post-form" className="grid grid-cols-[auto_1fr] gap-4">
          <label htmlFor="title" className="text-lg font-medium self-center">Title</label>
          <Input
            id="title"
            placeholder="Title"
            type="text"
            name="title"
            defaultValue={post?.title}
            className="flex-1 bg-secondary text-secondary-foreground"
          />
          <label htmlFor="content" className="text-lg font-medium">Content</label>
          <Textarea
            id="content"
            name="content"
            defaultValue={post?.content}
            rows={30}
            className="flex-1 bg-secondary text-secondary-foreground"
          />
          <div className="flex gap-4 col-start-2">
            <button type="submit">Save</button>
            <button
              type="button"
              className="text-secondary-foreground"
              onClick={() => {
                navigate(`/posts/${post._id}`, { replace: true });
              }}
            >Cancel</button>
          </div>
        </Form>
      ))
      }
    </>
  );
}