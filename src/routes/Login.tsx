import { ActionFunctionArgs, Form } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { IAuth } from "@/types";

export const action = (authData: IAuth) => async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());

  if (formData.username && formData.password) {
    await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(formData)
    })
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          case 401:
            throw new Error("Incorrect password.");
            break;
          case 404:
            throw new Error("Unknown user.");
            break;
          default:
            throw new Error(`${response.status} ${response.statusText}`);
        }
      })
      .then(response => {
        if (response.token)
          authData.setToken(response.token);
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  return null;
}

const Login = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 justify-center items-center">
      <h1 className="text-2xl font-semibold">Login</h1>
      <Form method="POST" className="flex flex-col gap-2 w-full max-w-[320px]">
        <Input placeholder="Username" type="text" name="username" />
        <Input placeholder="Password" type="password" name="password" />
        <button type="submit">Confirm</button>
      </Form>
    </div>
  );
};

export default Login;