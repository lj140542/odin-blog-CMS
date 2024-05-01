import { Post } from '@/types';
import { Form, Link, Outlet, redirectDocument, useLoaderData } from 'react-router-dom';
import '../sidebar.css'

export async function loader() {
  const data = await fetch(`${import.meta.env.VITE_API_URL}/posts`, { mode: 'cors', method: 'GET', credentials: 'include' })
    .then(response => {
      if (response.ok) return response.json();
      else return response;
    })
    .catch(error => {
      console.error(error);
      return null;
    });

  if (data.posts) return data.posts;
  else if (data.status && data.status == 403) return redirectDocument('/');
  else throw new Error(data.status ? `${data.status} ${data.statusText}` : data);
}

export async function action() {
  /*
    {
      "result": "done",
      "id": "6631875d3f4e5f8a96bf18ac",
      "url": "/posts/6631875d3f4e5f8a96bf18ac"
    }
  */
  const result = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ title: "[new post]", content: " ", }),
  })
    .then(response => {
      if (response.ok) return response.json();
      else return response;
    })
    .catch(error => {
      console.error(error);
      return error;
    })

  if (result.url) return redirectDocument(result.url + "/edit");
  else if (result.status && result.status == 403) return redirectDocument('/');
  else throw new Error(result.status ? `${result.status} ${result.statusText}` : result);
}

export default function Root() {
  const posts = useLoaderData() as Post[];

  return (
    <>
      <div id="sidebar" className="flex flex-col w-[22rem] bg-secondary text-secondary-foreground border-r border-r-secondary-foreground/25">
        <h1 className="flex items-center text-base font-medium m-0 py-4 px-8 order-1 border-t border-t-secondary-foreground/25">Odin Blog CMS</h1>
        <div className="flex items-center gap-2 py-4 border-b border-b-secondary-foreground/25">
          <form id="search-form" role="search" className="relative">
            <input
              placeholder="Search"
              type="search"
              name="q"
              className="input bg-secondary w-full pl-8 bg-search bg-no-repeat bg-pos-search bg-4 relative hover:shadow-[0_0px_1px_hsl(var(--secondary-foreground)/_0.6),_0_1px_2px_hsl(var(--secondary-foreground)/_0.2)]
              text-base border-none rounded-lg m-0 py-2 px-3"
            />
            <div
              id="search-spinner"
              className="w-4 h-4 bg-spinner animate-spin absolute left-[0.625rem] top-3"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </form>
          <Form method="post" className="relative">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav className="flex-1 overflow-auto pt-4">
          <ul className="p-0 m-0 list-none">
            {!posts ?
              (<div>Loading posts...</div>)
              : posts.length ?
                posts.map(post => {
                  return (
                    <li key={post._id}>
                      <Link to={`/posts/${post._id}`} className=''>{post.title}</Link>
                    </li>
                  )
                })
                : (<div>No post</div>)
            }
          </ul>
        </nav>
      </div>
      <div id="detail" className="flex-1 py-8 px-16 w-ful overflow-scroll">
        <Outlet />
      </div>
    </>
  );
}