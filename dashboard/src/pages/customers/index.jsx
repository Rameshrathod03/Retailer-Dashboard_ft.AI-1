import {
    Typography,
  } from "@material-tailwind/react";

import UserTable from "./UserTable";

const Customers = () => {
    return(
        <div className=" overflow-scroll">
            <UserTable />
        </div>
    )
}

export default Customers;