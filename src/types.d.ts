export interface IAuth {
  token: string | null,
  setToken: (newToken?: string) => void | null,
}

export interface Author {
  _id: string,
  firstname: string,
  lastname: string,
}

export interface Post {
  _id: string,
  author: Author,
  timestamp: Date,
  title: string,
  content: string,
  published?: boolean,
}

export interface Comment {
  _id: string,
  author: string,
  timestamp: Date,
  content: string,
}

export interface PostWithComments {
  post: Post,
  comments: Comment[]
}

export interface LoginActionResult {
  status?: number,
}