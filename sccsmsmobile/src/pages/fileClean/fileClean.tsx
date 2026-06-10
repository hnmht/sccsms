import { useEffect, useState } from "react";
import { Text, Button, Card, useTheme, Divider } from "react-native-paper";
import { ScrollView, View, Platform, Alert } from "react-native";
import RNFS from "react-native-fs";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { DateTimeFormat, dayjs } from "../../i18n/dayjs";
import ActivityOverlay from "../../components/ActivityOverlay/ActivityOverlay";
import { requestPermissions } from "../../components/tools/permission";

import { IRFRepo } from "../../db/crud/issueResolutionForm";
import { EORepo } from "../../db/crud/executionOrder";
import { WORepo } from "../../db/crud/workorder";

import { WorkOrder } from "../../dataType/types/workOrder";
import { ExecutionOrder } from "../../dataType/types/executionOrder";
import type { IssueResolutionForm } from "../../dataType/types/issueResolutionForm";
import { useSettingNavigation } from "../../navigation/config/screenParams";


const externalDir = `${RNFS.ExternalDirectoryPath}/Pictures`;
const cacheDir = RNFS.CachesDirectoryPath;
const maxScale = 1.2;

const calculationFiles = (files: RNFS.ReadDirItem[]) => {
    let number: number = 0;
    let sizeByte: number = 0;
    let sizeMB: number = 0;

    if (files instanceof Array) {
        files.forEach(file => {
            if (file.isFile()) {
                number = number + 1;
                sizeByte = sizeByte + file.size;
            }
        });
        if (sizeByte > 0) {
            sizeMB = parseFloat((sizeByte / (1024 * 1024)).toFixed(2));
        }
    }
    return { number: number, size: sizeMB }
};

function FileCleaning() {
    const theme = useTheme();
    const { t } = useTranslation()
    const navigation = useSettingNavigation();
    const [externalFileInfo, setExternalFileInfo] = useState({ number: 0, size: 0 });
    const [cacheFileInfo, setCacheFileInfo] = useState({ number: 0, size: 0 });
    const [overlayStatus, setOverlayStatus] = useState({ visible: false, description: "" });
    const [wos, setWos] = useState<WorkOrder[]>([]);
    const [eos, setEos] = useState<ExecutionOrder[]>([]);
    const [irfs, setIrfs] = useState<IssueResolutionForm[]>([]);
    const cacheCleanDisabled = cacheFileInfo.number === 0 || (eos.length + irfs.length) > 0;
    const isAndroid = Platform.OS === "android";
    // Check Permissions
    useEffect(() => {
        const checkPermission = async () => {
            const res = await requestPermissions();
            if (!res) {
                Alert.alert(
                    t("error"),
                    t("insufficientPermission"),
                    [
                        {
                            text: t("ok"),
                            onPress: navigation.goBack
                        }
                    ]
                )
            }
        }
        checkPermission();
    }, []);

    // Get local vouchers
    useEffect(() => {
        function getLocalData() {
            const newWOs = WORepo.getAllVouchers();
            const newDDs = IRFRepo.getAllVouchers();
            const newEOs = EORepo.getAllVouchers();
            setWos(newWOs);
            setEos(newEOs);
            setIrfs(newDDs);
        }
        getLocalData();
    }, []);

    useEffect(() => {
        async function getFilesInfo() {
            let pictureDirs: RNFS.ReadDirItem[] = [];
            let pictureDirExist = await RNFS.exists(externalDir);
            if (pictureDirExist) {
                pictureDirs = await RNFS.readDir(externalDir);
            }
            const cacheDirs = await RNFS.readDir(cacheDir);
            const pictureFileInfo = calculationFiles(pictureDirs);
            const cacheInfo = calculationFiles(cacheDirs);
            setExternalFileInfo(pictureFileInfo);
            setCacheFileInfo(cacheInfo);
        }
        getFilesInfo();
    }, []);

    // Actions after cleaning original photos, including deleting files and refreshing file info
    const handleCleanNativePicture = async () => {
        setOverlayStatus({ visible: true, description: t("deletingOriginalPhotos") });
        let dirs = await RNFS.readDir(externalDir);
        dirs.forEach(async (file) => {
            if (file.isFile()) {
                await RNFS.unlink(file.path);
            }
        });
        dirs = await RNFS.readDir(externalDir);
        const fileInfo = calculationFiles(dirs);
        setExternalFileInfo(fileInfo);
        setOverlayStatus({ visible: false, description: "" });
    };

    // Delete all original photos alert
    const handleCleanNativePictureAlert = () => {
        Alert.alert(t("tip"), t("cleanOriginalPhotosTip"), [
            {
                text: t("cancel"),
                onPress: () => { return }
            },
            {
                text: t("ok"),
                onPress: () => handleCleanNativePicture()
            }
        ]);
    };

    // Actions after cleaning attachment files, including deleting files and refreshing file info
    const handleCleanVoucherFile = async () => {
        setOverlayStatus({ visible: true, description: t("deletingAttachments") });
        // delete cacheDir/image_cache file generated by react-native-image-crop-picker, if it exists, to avoid affecting the calculation of cache file info and leaving empty folders in cacheDir after deleting attachments
        await RNFS.unlink(`${cacheDir}/image_cache`);
        // Delete all files in cacheDir, including attachments and image_cache, but keep folders, then refresh file info
        let dirs = await RNFS.readDir(cacheDir);
        dirs.forEach(async (file) => {
            if (file.isFile()) {
                await RNFS.unlink(file.path);
            }
        });
        dirs = await RNFS.readDir(cacheDir);
        const fileInfo = calculationFiles(dirs);
        setCacheFileInfo(fileInfo);
        setOverlayStatus({ visible: false, description: "" });
    };

    // Delete all local vouchers alert
    const handleDelAllLocalVoucherPress = async () => {
        Alert.alert(t("tip"), t("deleteLocalReceiptsTip"), [
            {
                text: t("cancel"),
                onPress: () => { return }
            },
            {
                text: t("ok"),
                onPress: () => handleDelAllLocalVoucher()
            }
        ]);
    };

    // Delete all local vouchers, including local WOs, EDs and DDs, then refresh local vouchers and file info
    const handleDelAllLocalVoucher = () => {
        setOverlayStatus({ visible: true, description: t("deletingLocalReceipts") });
        if (wos.length > 0) {
            WORepo.delAllVouchers(); 
        }
        if (eos.length > 0) {
            EORepo.delAllVouchers(); 
        }
        if (irfs.length > 0) {
            IRFRepo.delAllVouchers(); 
        }
        // Refresh local vouchers
        const newWOs = WORepo.getAllVouchers();
        const newDDs = IRFRepo.getAllVouchers();
        const newEOs = EORepo.getAllVouchers();
        setWos(newWOs);
        setEos(newEOs);
        setIrfs(newDDs);
        setOverlayStatus({ visible: false, description: "" });
    }
    // Delete local WO one by one, then refresh local WOs
    const handleDeleteLocalWO = (wo: WorkOrder) => {        
        WORepo.delVoucher(wo);        
        const newWOs = WORepo.getAllVouchers();
        setWos(newWOs);
    };
    // Delete local EO one by one, then refresh local EOs
    const handleDeleteLocalEO = (eo: ExecutionOrder) => {
        EORepo.delVoucher(eo);
        const newEOs = EORepo.getAllVouchers();
        setEos(newEOs);
    };
    // Delete local IRF one by one, then refresh local IRFs
    const handleDeleteLocalDD = (irf: IssueResolutionForm) => {
        IRFRepo.delVoucher(irf);
        const newDDs = IRFRepo.getAllVouchers();
        setIrfs(newDDs);
    };

    return (
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
            <ActivityOverlay
                visible={overlayStatus.visible}
                description={overlayStatus.description}
            />
            <ScrollView>
                {isAndroid
                    ? <Card style={{ marginHorizontal: 4, marginTop: 16, marginBottom: 8 }}>
                        <Card.Title
                            title={t("originalPhotos")}
                            titleMaxFontSizeMultiplier={maxScale}
                        />
                        <Card.Content>
                            <Text variant="bodyMedium" maxFontSizeMultiplier={maxScale} style={{ width: "100%", color: theme.colors.primary }}>
                                {t("cleanupOrginalPhotosDesc")}
                            </Text>
                            <Text maxFontSizeMultiplier={maxScale}>{`${t("filePath")} : ${externalDir}`}</Text>
                            <Text maxFontSizeMultiplier={maxScale}>{`${t("numberOfFiles")} : ${externalFileInfo.number}`}</Text>
                            <Text maxFontSizeMultiplier={maxScale}>{`${t("storageUsed")} : ${externalFileInfo.size}M`}</Text>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="text"
                                disabled={externalFileInfo.number === 0}
                                textColor={theme.colors.error}
                                onPress={handleCleanNativePictureAlert}
                            >
                                {t("deleteAll")}
                            </Button>
                        </Card.Actions>
                    </Card>
                    : null
                }

                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={"localReceipts"}
                        titleMaxFontSizeMultiplier={1.5}
                    />
                    <Card.Content>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.primary }}>
                            {t("localReceiptsDesc")}.
                        </Text>
                        <Divider />
                        {wos.length > 0
                            ? <>
                                <Text maxFontSizeMultiplier={maxScale} variant="titleMedium">{t("wo")}</Text>
                                {wos.map(wo => {
                                    return (
                                        <View key={wo.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{DateTimeFormat(wo.billDate,"LL")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LW${wo.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{wo.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalWO(wo)}
                                            >
                                                {t("delete")}
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                        {eos.length > 0
                            ? <>
                                <Text variant="titleMedium">{t("eo")}</Text>
                                {eos.map(eo => {
                                    return (
                                        <View key={eo.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{DateTimeFormat(eo.billDate,"LL")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LE${eo.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{eo.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalEO(eo)}
                                            >
                                                {t("delete")}
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                        {irfs.length > 0
                            ? <>
                                <Text variant="titleMedium">{t("irf")}</Text>
                                {irfs.map(irf => {
                                    return (
                                        <View key={irf.id} style={{ display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                            <Text maxFontSizeMultiplier={maxScale}>{DateTimeFormat(irf.billDate,"LL")}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{`LD${irf.id}`}</Text>
                                            <Text maxFontSizeMultiplier={maxScale}>{irf.creator.name}</Text>
                                            <Button
                                                mode="text"
                                                textColor={theme.colors.error}
                                                onPress={() => handleDeleteLocalDD(irf)}
                                            >
                                                {t("delete")}
                                            </Button>
                                        </View>
                                    )
                                })}
                                <Divider />
                            </>
                            : null
                        }
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="text"
                            disabled={(wos.length + eos.length + irfs.length) === 0}
                            textColor={theme.colors.error}
                            onPress={handleDelAllLocalVoucherPress}
                        >
                            {t("deleteAll")}
                        </Button>
                    </Card.Actions>
                </Card>
                <Card style={{ marginHorizontal: 4, marginTop: 8, marginBottom: 8 }}>
                    <Card.Title
                        title={t("attachments")}
                        titleMaxFontSizeMultiplier={1.5}
                    />
                    <Card.Content>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.primary }}>
                            {t("deleteAttachmentsDesc")}
                        </Text>
                        <Text maxFontSizeMultiplier={maxScale} variant="bodyMedium" style={{ width: "100%", color: theme.colors.error }}>
                            {t("deleteAttachmentsWarn")}
                        </Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`${t("filePath")} : ${cacheDir}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`${t("numberOfFiles")} : ${cacheFileInfo.number}`}</Text>
                        <Text maxFontSizeMultiplier={maxScale}>{`${t("storageUsed")} : ${cacheFileInfo.size}M`}</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button
                            mode="text"
                            textColor={theme.colors.error}
                            disabled={cacheCleanDisabled}
                            onPress={handleCleanVoucherFile}
                        >
                            {t("deleteAll")}
                        </Button>
                    </Card.Actions>
                </Card>
            </ScrollView>
            <View style={{ width: "100%", alignItems: "center", justifyContent: "center", margin: 8 }}>
                <Button mode="elevated" onPress={() => navigation.goBack()} style={{ width: "40%" }} >{t("back")}</Button>
            </View>
        </SafeAreaView>
    )
};

export default FileCleaning;
