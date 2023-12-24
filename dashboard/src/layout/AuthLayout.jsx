import { Outlet, useNavigate, useLocation } from "react-router-dom";

const AuthLayout = () => {
    return(
        <div className="flex flex-row align-middle justify-center min-h-svh p-2 min-w-svw bg-[#343434]"> 
            {<Outlet />}
        </div>
    )
}

export default AuthLayout;