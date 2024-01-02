import {
    Typography,
    Button,
  } from "@material-tailwind/react";

import BarGraph from "./BarGraph";
import PieChart from "./PieChart";

const Dashboard = () => {
    return(
        <div className="overflow-y-scroll">
            <Typography variant="h3" color="blue-gray">
                Dashboard
            </Typography>
            <br />
            <a href="/profile"><Button>Profile Form</Button></a>
        </div>
    )
}

export default Dashboard;