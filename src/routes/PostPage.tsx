import { PostWithComments } from "@/types";
import { Form, LoaderFunctionArgs, redirectDocument, useLoaderData } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"

export async function loader({ params }: LoaderFunctionArgs) {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/posts/${params._id}`, { mode: 'cors', method: 'GET', credentials: 'include' })
    .then(response => {
      if (response.ok) return response.json();
      else return response;
    })
    .catch(error => {
      console.error(error);
      return error;
    });

  if (data.post) return data
  else if (data.status && data.status == 403) return redirectDocument('/');
  else throw new Error(data.status ? `${data.status} ${data.statusText}` : data);
}

export default function PostPage() {
  const { post, comments } = useLoaderData() as PostWithComments;

  return (
    <>
      {(post && (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 w-full">
            <h2 className="text-5xl font-medium">{post.title}</h2>
            <span className="grid grid-cols-[120px_120px_120px] gap-4 items-center">
              <Form action="edit">
                <button className="h-8 w-full py-0">Edit</button>
              </Form>
              <Form method="post" action={`${post.published ? "unpublish" : "publish"}`}>
                <button className="h-8 w-full py-0">{post.published ? "Unpublish" : "Publish"}</button>
              </Form>
              <Form
                method="post"
                action="delete"
                onSubmit={(event) => {
                  if (
                    !confirm(
                      "Please confirm you want to delete this record."
                    )
                  ) {
                    event.preventDefault();
                  }
                }}
              >
                <button className="h-8 w-full py-0 text-red-600">Delete</button>
              </Form>
            </span>
            <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </div>

          {comments.length > 0 &&
            (
              <div>
                <h2 className="text-xl font-medium">Comments</h2>
                <Table>
                  <TableHeader>
                    <TableRow className="text-base hover:bg-inherit">
                      <TableHead className="font-semibold">Author</TableHead>
                      <TableHead className="font-semibold">Comment</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map(comment => {
                      return (
                        <TableRow key={comment._id} className="hover:bg-inherit">
                          <TableCell>{comment.author}</TableCell>
                          <TableCell>{comment.content}</TableCell>
                          <TableCell>
                            <Form
                              method="post"
                              action={`comment/${comment._id}/delete`}
                              onSubmit={(event) => {
                                if (
                                  !confirm(
                                    "Please confirm you want to delete this comment."
                                  )
                                ) {
                                  event.preventDefault();
                                }
                              }}
                            >
                              <button className="h-8 w-full py-0 text-red-600">Delete</button>
                            </Form>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )
          }

        </div>
      ))
      }
    </>
  );
}