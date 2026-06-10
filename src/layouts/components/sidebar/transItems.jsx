import Home from "@mui/icons-material/Home";
import Bookmark from "@mui/icons-material/Bookmark";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import People from "@mui/icons-material/People";
import Assessment from "@mui/icons-material/Assessment";
import Article from "@mui/icons-material/Article";
import ContactPhone from "@mui/icons-material/ContactPhone";
import RunCircle from "@mui/icons-material/RunCircle";
import AccessAlarm from "@mui/icons-material/AccessAlarm";
import Info from "@mui/icons-material/Info";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import Campaign from "@mui/icons-material/Campaign";
import Settings from "@mui/icons-material/Settings";
import Password from '@mui/icons-material/Key';
import Message from '@mui/icons-material/Message';
import School from '@mui/icons-material/School';
import Inventory from '@mui/icons-material/Inventory';
import Masks from '@mui/icons-material/Masks';
import Streetview from '@mui/icons-material/Streetview';

import { toTree } from "../../../utils/tree";

const iconMap = new Map([
    ["Home", Home],
    ["Bookmark", Bookmark],
    ["CalendarMonth", CalendarMonth],
    ["People", People],
    ["Assessment", Assessment],
    ["Article", Article],
    ["ContactPhone", ContactPhone],
    ["RunCircle", RunCircle],
    ["AccessAlarm", AccessAlarm],
    ["Info", Info],
    ["FormatListNumbered", FormatListNumbered],
    ["ManageAccounts", ManageAccounts],
    ["Campaign", Campaign],
    ["Settings", Settings],
    ["Password", Password],
    ["Message", Message],
    ["School", School],
    ["Inventory", Inventory],
    ["Masks", Masks],
    ["Streetview", Streetview]
]);

function transItems(menuList,t) {
    let managementSection = [];
    let systemSection = [];
    let mySection = [];   

    menuList.forEach((item) => {
        let routeitem = {
            id: item.id,
            fatherID: item.fatherID,
            href: item.path,
            title: t(item.title),
            icon: iconMap.get(item.icon),
        };

        if (item.id < 9000) {
            managementSection.push(routeitem);
        } else if (item.id >= 9000 && item.id < 9900) {
            systemSection.push(routeitem);
        } else {
            mySection.push(routeitem);
        }
    });

    let navItems = [];
    if (managementSection.length > 0) {
        navItems.push({
            title: t("labelBusinessOperations"),
            pages: toTree(managementSection, 0),
        });
    };

    if (systemSection.length > 0) {
        navItems.push({
            title: t("labelSystemAdministration"),
            pages: toTree(systemSection, 0),
        });
    };

    if (mySection.length > 0) {
        navItems.push({
            title: t("labelMy"),
            pages: toTree(mySection, 0),
        });
    }
    return navItems;
}

export default transItems;