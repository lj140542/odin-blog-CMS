import '../sidebar.css'

export default function Root() {
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
          <form method="post" className="relative">
            <button type="submit">New</button>
          </form>
        </div>
        <nav className="flex-1 overflow-auto pt-4">
          <ul className="p-0 m-0 list-none">
            <li>
              <a href={`/contacts/1`}>Your Name</a>
            </li>
            <li>
              <a href={`/contacts/2`}>Your Friend</a>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail" className="flex-1 py-8 px-16 w-full"></div>
    </>
  );
}