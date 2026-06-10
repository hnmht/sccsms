import { ComponentType } from "react";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import {
    View,
    FlatList,
    ListRenderItemInfo
} from "react-native";
import { DataTable, useTheme, TextInput, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface docListProps<T> {
    rows: T[];
    ItemElement: ComponentType<{ item: T, index: number }>;
    rowsPerPage: number;
    searchFields: string[];
    sortFunction: (a: T, b: T) => number;
    refreshing: boolean;
}

// Master data list
function DocList<T>({ rows, ItemElement, rowsPerPage, searchFields, sortFunction, refreshing }: docListProps<T>) {
    // Theme
    const theme = useTheme();
    // Keyword filter
    const [keyWord, setKeyWord] = useState<string>("");
    const [page, setPage] = useState<number>(0);
    const { t } = useTranslation();
    const searchedRows = matchSorter(rows, keyWord, { keys: searchFields });
    //currentRows
    const currentRows = searchedRows.sort(sortFunction).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    //Pagination
    const from = page * rowsPerPage;
    const to = Math.min((page + 1) * rowsPerPage, currentRows.length);

    useEffect(() => {
        setPage(0);
    }, [keyWord, rows]);

    return (
        <>
            <View style={{
                padding: 2,
                height: 60,
                width: "100%",
                backgroundColor: theme.colors.background
            }}>
                <TextInput
                    mode="outlined"
                    value={keyWord}
                    onChangeText={(text) => setKeyWord(text)}
                    left={<TextInput.Icon icon="text-search" color={theme.colors.primary} />}
                    right={keyWord !== "" ? <TextInput.Icon icon="close" color={theme.colors.primary} onPress={() => setKeyWord("")} /> : null}
                    placeholder={t("enterToSearch")}
                    dense
                />
            </View>
            {refreshing
                ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                    <ActivityIndicator animating={true} size="small" />
                </View>
                : currentRows.length === 0
                    ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                        <Text variant="bodyMedium">{t("noData")}</Text>
                    </View>
                    : null
            }
            <FlatList
                data={currentRows}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }: ListRenderItemInfo<T>) => <ItemElement item={item} index={index} />}
            />
            <View style={{ height: 40, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(searchedRows.length / rowsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${to} ${t("of")} ${searchedRows.length}`}
                    showFastPaginationControls
                    numberOfItemsPerPage={rowsPerPage}
                    selectPageDropdownLabel={t('perPage')}
                />
            </View>
        </>
    );
};
export default DocList;

