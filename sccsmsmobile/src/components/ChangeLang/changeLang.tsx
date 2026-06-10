import { useState } from "react";
import { Menu, Button } from "react-native-paper";
import { resources, i18n } from "../../i18n/i18n";

function ChangeLanguage() {
    const [visible, setVisible] = useState(false);
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const handleChangeLanguage = (lng: string) => {
        setCurrentLang(lng);
        i18n.changeLanguage(lng);
        setVisible(false);
    };
    return (<Menu
        // There is a bug in the React native Paper Menu component where
        // the menu fails to pop up after second click. It requires a key change
        // to force the menu to trigger correctly.
        // https://github.com/callstack/react-native-paper/issues/4807
        key={"selectLanguage"}
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
            <Button mode="text" onPress={() => setVisible(true)}>
                {currentLang ? resources[currentLang].label : "Select Language"}
            </Button>
        }
    >
        {
            resources && Object.keys(resources).map((lng) => (
                <Menu.Item
                    key={lng}
                    onPress={() => handleChangeLanguage(lng)}
                    title={resources[lng].label}
                />
            ))
        }
    </Menu>);
}

export default ChangeLanguage;
