import { Outlet, useNavigate, useLocation } from "react-router-dom";

import SideBar from "../components/global/SideBar";

import Breadcrumbs from "../components/global/Breadcrumbs";

import {
    Card,
  } from "@material-tailwind/react";

const Layout = () => {
    return(
        <div className="grid-cols-12 flex flex-row flex-nowrap p-4 gap-2  bg-[#363636]">
            <div className="col-span-1 md:col-span-3 lg:col-span-4 relative">
                <SideBar />
            </div>
            <div className="col-span-12 md:col-span-9 lg:col-span-8 w-full">
                <Card className="w-full min-h-full md:max-h-40 p-6 flex flex-col gap-4 pt-4">
                    {/* <Breadcrumbs/> */}
                    {<Outlet />}
                </Card>
            </div>
        </div>
    )
}

export default Layout;