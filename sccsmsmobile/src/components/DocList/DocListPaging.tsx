import {
    View,
    FlatList,
    ListRenderItemInfo
} from "react-native";
import { DataTable, useTheme, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";

interface docListPagingProps<T> {
    rows: T[];
    ItemElement: React.ComponentType<{ item: T, index: number }>;
    refreshing: boolean;
    rowCount: number;
    rowsPerPage: number;
    page: number;
    pageChangeAction: (page: number) => void;
}

function DocListPaging<T>({
    rows = [],
    ItemElement = () => <View />,
    refreshing = false,
    rowCount,
    rowsPerPage,
    page,
    pageChangeAction,

}: docListPagingProps<T>) {
    const theme = useTheme();
    const { t } = useTranslation();
    const from = page * rowsPerPage;
    const to = Math.min((page + 1) * rowsPerPage, rowCount);
    return (
        <>
            {refreshing
                ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                    <ActivityIndicator animating={true} size="small" />
                </View>
                : rows.length === 0
                    ? <View style={{ width: "100%", alignItems: "center", justifyContent: "center", marginTop: 16 }}>
                        <Text variant="bodyMedium">{t("noData")}</Text>
                    </View>
                    : null
            }
            <FlatList
                data={rows}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }: ListRenderItemInfo<T>) => <ItemElement item={item} index={index} />}
            />
            <View style={{ height: 40, width: "100%", justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.ceil(rowCount / rowsPerPage)}
                    onPageChange={page => pageChangeAction(page)}
                    label={`${from + 1}-${to} ${t("of")} ${rowCount}`}
                    showFastPaginationControls
                    numberOfItemsPerPage={rowsPerPage}
                    selectPageDropdownLabel={t('perPage')}
                />
            </View>
        </>
    );
};
export default DocListPaging;