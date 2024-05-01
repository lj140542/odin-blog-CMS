import { ActionFunctionArgs, Form, useActionData } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { IAuth, LoginActionResult } from "@/types";

export const action = (authData: IAuth) => async ({ request }: ActionFunctionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  let actionResult = null;
  if (formData.username && formData.password) {
    actionResult = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (response.ok) return response.json();
        else return response;
      })
      .catch(error => {
        console.error(error);
        return null;
      });
  }

  if (actionResult?.token) authData.setToken(actionResult.token);
  return { status: actionResult?.status };

}

const Login = () => {
  const actionResult = useActionData() as LoginActionResult;

  return (
    <div className="w-full h-full flex flex-col gap-3 mt-[20dvh] items-center">
      <h1 className="text-2xl font-semibold">Login</h1>
      <Form method="POST" className="flex flex-col gap-2 w-full max-w-[320px]">
        <Input placeholder="Username" type="text" name="username" />
        <Input placeholder="Password" type="password" name="password" />
        <button type="submit">Confirm</button>
      </Form>
      {
        actionResult != null && (
          <div className="text-red-600 font-medium">
            {actionResult.status == 401 && (<>Bad user/password association.</>)}
            {actionResult.status == 404 && (<>User unknown.</>)}
          </div>
        )
      }
    </div>
  );
};

export default Login;