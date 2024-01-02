import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Input,
    Button,
} from "@material-tailwind/react";
 
import { EyeIcon, ArchiveBoxIcon } from "@heroicons/react/24/solid";

const Inventory =() => {
  const data = [
    {
      label: "HTML",
      value: "html",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "React",
      value: "react",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Vue",
      value: "vue",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
    {
      label: "Angular",
      value: "angular",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Svelte",
      value: "svelte",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];
 
  return (
    <div className=" overflow-scroll">
        <div className="mb-10 flex items-center justify-between gap-8 px-2 pt-1">
                <div>
                <Typography variant="h5" color="blue-gray">
                    Inventory Tally
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    See information about all the registered customers.
                </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <a href='/add-category'><Button variant="outlined" size="sm">
                    Add Category
                </Button></a>
                <a href="/add-item"><Button className="flex items-center gap-3" size="sm">
                    <ArchiveBoxIcon strokeWidth={2} className="h-4 w-4" /> Add Items
                </Button></a>
                </div>
        </div>
        
        <Tabs value="html" orientation="vertical">
            <TabsHeader className=" w-48">
                {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                    {label}
                </Tab>
                ))}
            </TabsHeader>
            <TabsBody className="">
                {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value} className="py-0">
                    {desc}
                </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    </div>
  );
}

export default Inventory;