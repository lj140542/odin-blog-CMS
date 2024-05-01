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
            <span className="grid grid-cols-[100px_100px] gap-4 items-center">
              <Form action="edit">
                <button className="h-8 w-full py-0">Edit</button>
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
                    <TableRow>
                      <TableHead>Author</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comments.map(comment => {
                      return (
                        <TableRow key={comment._id}>
                          <TableCell>{comment.author}</TableCell>
                          <TableCell>{comment.content}</TableCell>
                          <TableCell>
                            <button className="m-0 p-0 bg-transparent border-0 shadow-none hover:shadow-none hover:scale-125 duration-500 ">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 fill-primary-foreground hover:fill-primary-foreground/75">
                                <title>delete</title>
                                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                              </svg>
                            </button>
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