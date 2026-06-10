import { useState } from "react";
import {
    Grid,
    Card,
    CardHeader,
    Typography,
    List,
    Avatar,
    CardContent,
    ListItemText,
    ListItemIcon,
    ListItem,
    Box,
    Input,
    IconButton,
    Tooltip,
    Link
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { EmailIcon, PhoneIcon, RefreshIcon } from "../../../component/PubIcon/PubIcon";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { matchSorter } from "match-sorter";
import { Divider } from "../../../component/ScMui/ScMui";
import PageTitle from "../../../component/PageTitle/PageTitle";
import { useEffect } from "react";
import { reqGetPersons } from "../../../api/person";
import { MultiSortByArr } from "../../../utils/tools";
import useContentHeight from "../../../hooks/useContentHeight";


const keys = ["code", "name", "deptName", "description", "email", "mobile", "deptCode"];
const sortArr = [{ field: "id", order: "asc" }];

function AddressBook() {
    const [persons, setPersons] = useState([]);
    const [keyword, setKeyword] = useState("");
    const {t} = useTranslation();
    const contentHeight = useContentHeight();

    useEffect(() => {
        handlePersonsRefresh();
    }, []);
    // Refresh List
    const handlePersonsRefresh = async () => {
        const res = await reqGetPersons();
        let newPersons = [];
        if (res.status) {
            newPersons = res.data;
        }
        setPersons(newPersons);
    };

    return (
        <>
            <PageTitle pageName={t("MenuAddressBook")} displayHelp={false} helpUrl="#" />
            <Divider my={0} />
            <Card sx={{ height: contentHeight }}>
                <CardContent>
                    <Box
                        bgcolor="background.paper"
                        sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", px: 0 }}
                    >
                        <Input
                            placeholder={t("enterToSearch")}
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                        <Tooltip title={t("refresh")} placement="top">
                            <IconButton onClick={handlePersonsRefresh}>
                                <RefreshIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Divider my={2} />
                    <Box sx={{ width: "100%", height: contentHeight - 52, overflow: "auto" }}>
                        <ReactPerfectScrollbar>
                            <Grid container spacing={2}>
                                {matchSorter(persons, keyword, { keys: keys })
                                    .sort(MultiSortByArr(sortArr))
                                    .map((person) => {
                                        return person.status === 0
                                            ? (
                                                <Grid item xs={4} key={person.id}>
                                                    <Card>
                                                        <CardHeader
                                                            avatar={
                                                                <Avatar alt={person.code} src={person.avatar.fileUrl} />
                                                            }
                                                            title={person.name}
                                                            subheader={person.deptName}
                                                        />
                                                        <Divider />
                                                        <CardContent>
                                                            <Grid container spacing={1}>
                                                                <Grid item xs={12}>
                                                                    <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5, height: 32 } }}>
                                                                        <ListItem >
                                                                            <ListItemIcon>
                                                                                <PhoneIcon />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary={person.mobile} color="secondary" />
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                <Grid item xs={12}>
                                                                    <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5, height: 32 } }}>
                                                                        <ListItem>
                                                                            <ListItemIcon>
                                                                                <EmailIcon />
                                                                            </ListItemIcon>
                                                                            <ListItemText primary={<Typography color="secondary" fontSize={16}><Link href={`mailto:${person.email}`} target="_blank">{person.email}</Link></Typography>} />
                                                                        </ListItem>
                                                                    </List>
                                                                </Grid>
                                                                <Grid item xs={12} sx={{ height: 60, mt: 2 }}>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {person.description}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            )
                                            : null
                                    })}
                            </Grid>
                        </ReactPerfectScrollbar>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
export default AddressBook;
