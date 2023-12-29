import {
    Typography,
  } from "@material-tailwind/react";

import UserTable from "./UserTable";
import { useAuthState } from '../../firebase'

const Customers = () => {

    const { user } = useAuthState()

    return(
        <div className=" overflow-scroll">
            <UserTable />
        </div>
    )
}

export default Customers;