import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();
  // const authState = useSelector((state) => state.auth); // Track auth state

  // useEffect(() => {
  //   console.log("Auth state updated:", authState);
  // }, [authState]);

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData)).then((data) => {
      // console.log("Login action result:", data);

      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        });
        // toast({ title: data?.payload?.message });

        // // Store the token in session storage
        // if (data?.payload?.token) {
        //   console.log("Storing token in sessionStorage:", data.payload.token);
        //   sessionStorage.setItem("authToken", data.payload.token);
        // } else {
        //   console.error("Login successful but token is missing!");
        // }
      } else {
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });

    // Debug: Check if token is set in session storage
    // setTimeout(() => {
    //   console.log("Token in sessionStorage after login:", sessionStorage.getItem("authToken"));
    // }, 1000);
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account?
          <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/register">
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
