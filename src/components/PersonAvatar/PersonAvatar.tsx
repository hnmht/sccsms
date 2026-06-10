import { Avatar } from "react-native-paper";
import { useAppSelector } from "../../store/hooks";

interface PersonAvatarProps {
    url: string | undefined;
    name: string;
}

function PersonAvatar({ url, name }: PersonAvatarProps) {
    const isOffline = useAppSelector(state => state.appInfo.isOffline);
    const showAvatar = url === undefined || url === "" || url === null || isOffline === 1;
    return (
        showAvatar
            ? <Avatar.Text size={48} label={name.charAt(0).toUpperCase()} />
            : <Avatar.Image size={48} source={{ uri: url }} onError={(err) => { console.error(err) }} />
    );
};

export default PersonAvatar;
