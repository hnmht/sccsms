import { useState } from "react";
import { useTheme, IconButton, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { List, ListItem, ListItemButton } from "./leaf";
import ScCollapse from "../../ScCollapse/ScCollapse";
import { toTree } from "../../tools/tree";

interface ScPubTreeProps<T> {
    docName: string;
    isDisplayAll: boolean;
    oriDocs: T[];
    onDocPress: (item: T, type: number) => void; // type:0-Child Node 1-Parent Node 2-Expand All 3-All Records
    selectDocIDs: number[];
    onDocLongPress: (item: T, type: number) => void;
    isEdit: boolean;
}

interface RenderItemProps<T> {
    item: T;
    level: number;
}

interface RenderListProps<T> {
    data: T[];
    listKey: number;
    level: number;
}

const ScPubTree = ({ docName, isDisplayAll, oriDocs, onDocPress, selectDocIDs, onDocLongPress, isEdit }: ScPubTreeProps<any>) => {
    const theme = useTheme();
    const [openAll, setOpenAll] = useState(true);
    const { t } = useTranslation();
    const docTree = toTree(oriDocs, 0);
    const RenderItem = ({ item, level }: RenderItemProps<any>) => {
        const [open, setOpen] = useState(true);
        const handleExpandPress = () => {
            setOpen(!open);
        };

        return (
            item.children
                ? <>
                    <ListItem key={"parentItem" + item.id} style={{ height: 40, padding: 0, margin: 0, paddingLeft: level * 8 + 8, width: "100%", paddingRight: 2 }}>
                        <IconButton
                            key={"parenticonbutton" + item.id}
                            icon={open ? "chevron-up" : "chevron-down"}
                            style={{ padding: 0, margin: 0 }}
                            onPress={handleExpandPress}
                        />
                        <ListItemButton
                            key={"parentitembutton" + item.id}
                            onPress={() => onDocPress(item, 1)}
                            onLongPress={() => onDocLongPress(item, 1)}
                            disabled={!isEdit}
                        >
                            <Text key={"parentitemtext" + item.id} variant="titleMedium" style={{ color: item.status === 1 ? "red" : theme.colors.onBackground }}>{item.name}</Text>
                        </ListItemButton>
                        {selectDocIDs.includes(item.id) ? <IconButton icon="check" /> : null}
                    </ListItem>
                    <ScCollapse key={"collapse" + item.id} expanded={open} style={{ padding: 0, margin: 0 }}>
                        <RenderList data={item.children} listKey={item.id} level={level} />
                    </ScCollapse></>
                : <ListItem key={"child" + item.id} style={{ height: 40, padding: 0, margin: 0, paddingLeft: level * 8 + 8, width: "100%", paddingRight: 2 }}>
                    <IconButton
                        key={"childexpandless" + item.id}
                        icon={"touch-text-outline"}
                        style={{ padding: 0, margin: 0 }}
                        onPress={() => { }}
                        disabled
                    />
                    <ListItemButton
                        key={"childitembutton" + item.id}
                        disabled={!isEdit}
                        onPress={() => onDocPress(item, 0)}
                        onLongPress={() => onDocLongPress(item, 0)}
                    >
                        <Text key={"childitemtext" + item.id} variant="titleSmall" style={{ color: item.status === 1 ? "red" : theme.colors.onBackground }} >{item.name}</Text>
                    </ListItemButton>
                    {selectDocIDs.includes(item.id) ? <IconButton icon="check" /> : null}
                </ListItem>
        );
    };

    const RenderList = ({ data, listKey, level }: RenderListProps<any>) => {
        const levelA = level + 1;
        return (
            <List key={listKey} style={{ padding: 0, margin: 0, paddingLeft: level + 2, width: "100%" }}>
                {data.map((item) => (
                    <RenderItem item={item} key={item.id} level={levelA} />
                ))}
            </List>
        );
    };

    return (
        <List style={{}}>
            {isDisplayAll
                ? <>
                    <ListItem key={"allitem"} style={{ height: 40, padding: 0, margin: 0, width: "100%", paddingRight: 2 }}>
                        <IconButton icon={openAll ? "chevron-up" : "chevron-down"} onPress={() => setOpenAll(!openAll)} />
                        <ListItemButton key="openAllItemButton"
                            onPress={() => onDocPress(oriDocs, 3)}
                            onLongPress={() => onDocLongPress(oriDocs, 3)}
                            disabled={!isEdit}
                        >
                            <Text variant="titleMedium">{t("all") + " " + docName}</Text>
                        </ListItemButton>
                        {oriDocs.length <= selectDocIDs.length && oriDocs.length !== 0 ? <IconButton icon="check" /> : null}
                    </ListItem>
                    <ScCollapse key="collapseAll" expanded={openAll} style={{ padding: 0, margin: 0 }}>
                        <RenderList data={docTree} listKey={0} level={0} />
                    </ScCollapse>
                </>
                : <RenderList data={docTree} listKey={0} level={0} />
            }
        </List>
    );
};

export default ScPubTree;
