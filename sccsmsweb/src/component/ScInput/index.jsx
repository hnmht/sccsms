import ScDataTypeSelect from "./ScDataTypeSelect/ScDataTypeSelect"; //101 Date Type Select Input Component

import ScTextInput from "./ScTextInput/ScTextInput"; //301 Text Input
import ScNumberInput from "./ScNumberInput/ScNumberInput"; //302 Number Input
import ScPasswordInput from "./ScPasswordInput/ScPasswordInput"; //303 Password Input
// import ScMobileInput from "./ScMobileInput/ScMobileInput"; //304 Mobile Input
import ScEmailInput from "./ScEmailInput/ScEmailInput"; //305 Email Input
import ScDateInput from "./ScDateInput/ScDateInput"; //306 Date Input
import ScDateTimeInput from "./ScDateTimeInput/ScDateTimeInput"; //307 Date time Input 
import ScDateDisplay from "./ScDateDisplay/ScDateDisplay"; // 308 Date Display
import ScDateTimeDisplay from "./ScDateTimeDisplay/ScDateTimeDisplay"; // 309 Date Time Display

import ScGenderSelect from "./ScGenderSelect/ScGendeSelectr"; //401 Gender Select Input
import ScSwitchYesOrNo from "./ScSwitchYesOrNo/ScSwitchYesOrNo"; //402 Switch Input Yes Or No 
import ScCheckYesOrNo from "./ScCheckYesOrNo/ScCheckYesOrNo"; //403 CheckBox Input Yes Or No
import ScSelectYesOrNo from "./ScSelectYesOrNo/ScSelectYesOrNo"; //404 Select Input Yes Or No
import ScVoucherStatus from "./ScVoucherStatus/ScVoucherStatus"; //405 Display Voucher Status
import ScColorSelect from "./ScColorSelect/ScColorSelect"; //406 Color Select Input
import ScPeriodSelect from "./ScPeriodSelect/ScPeriodSelect"; //407 Perios Select Input

import ScRoleSelects from "./ScRoleSelects/ScRoleSelects"; //501 Roles Multiple Select Input
import ScPersonSelects from "./ScPersonSelects/ScPersonSelects"; // 502 Persons Multiple Select Input
import ScPersonSelect from "./ScPersonSelect/ScPersonSelect"; // 510 Person Select Input
import ScDeptSelect from "./ScDeptSelect/ScDeptSelect"; //520 Department Select Input
import ScCSCSelect from "./ScCSCSelect/ScCSCSelect"; //525 Construction Site Categroy Select Input
import ScUDCSelect from "./ScUDCSelect/ScUDCSelect"; //530 User-define Category Select Input
import ScEPCSelect from "./ScEPCSelect/ScEPCSelect"; //540 Execution Project Category Select Input
import ScUDASelect from "./ScUDASelect/ScUDASelect"; //550 User-define Archive Select Input
import ScEPASelect from "./ScEPASelect/ScEPASelect"; //560 Execution Project Select Input
import ScCSASelect from "./ScCSASelect/ScCSASelect"; //570 Construction Site Select Input
import ScEPTSelect from "./ScEPTSelect/ScEPTSelect"; //580 Execution Project Template Select Input
import ScRLSelect from "./ScRiskLevelSelect/ScRiskLevelSelect"; //590 Risk Level Select Input
import ScDCSelect from "./ScDcSelect/ScDCSelect"; //600 Document Category Select Input
import ScPositionSelect from "./ScPositionSelect/ScPositionSelect"; //610 Position Select Input
import ScTCSelect from "./ScTCSelect/ScTCSelect"; //620 Training Course Select Input
import ScPPESelect from "./ScPPESelect/ScPPESelect"; //630 Personal Protective Equipment Select Input

import ScAvatarUpload from "./ScAvatarUpload/ScAvatarUpload"; //901 Avatar File Upload
import ScFileUpload from "./ScFileUpload/ScFileUpload"; //902 Multiple Files Upload
import ScImpageUpload from "./ScImageUpload/ScImageUpload"; //903 Image File Upload

const ScInput = (props) => {
    const {
        dataType
    } = props;
    switch (dataType) {
        case 101:
            return <ScDataTypeSelect {...props} />;
        case 301:
            return <ScTextInput {...props} />;
        case 302:
            return <ScNumberInput {...props} />;
        case 303:
            return <ScPasswordInput {...props} />;
        // case 304:
        //     return <ScMobileInput {...props} />;
        case 305:
            return <ScEmailInput {...props} />;
        case 306:
            return <ScDateInput {...props} />;
        case 307:
            return <ScDateTimeInput {...props} />;
        case 308:
            return <ScDateDisplay {...props} />;
        case 309:
            return <ScDateTimeDisplay {...props} />;
        case 401:
            return <ScGenderSelect {...props} />;
        case 402:
            return <ScSwitchYesOrNo {...props} />;
        case 403:
            return <ScCheckYesOrNo {...props} />;
        case 404:
            return <ScSelectYesOrNo {...props} />;
        case 405:
            return <ScVoucherStatus {...props} />;
        case 406:
            return <ScColorSelect {...props} />;
        case 407:
            return <ScPeriodSelect {...props} />;
        case 501:
            return <ScRoleSelects {...props} />;
        case 502:
            return <ScPersonSelects {...props} />;
        case 510:
            return <ScPersonSelect {...props} />;
        case 520:
            return <ScDeptSelect {...props} />;
        case 525:
            return <ScCSCSelect {...props} />;
        case 530:
            return <ScUDCSelect {...props} />;
        case 540:
            return <ScEPCSelect {...props} />;
        case 550:
            return <ScUDASelect {...props} />;
        case 560:
            return <ScEPASelect {...props} />;
        case 570:
            return <ScCSASelect {...props} />;
        case 580:
            return <ScEPTSelect {...props} />;
        case 590:
            return <ScRLSelect {...props} />;
        case 600:
            return <ScDCSelect {...props} />;
        case 610:
            return <ScPositionSelect {...props} />;
        case 620:
            return <ScTCSelect {...props} />;
        case 630:
            return <ScPPESelect {...props} />;
        case 901:
            return <ScAvatarUpload {...props} />;
        case 902:
            return <ScFileUpload {...props} />;
        case 903:
            return <ScImpageUpload {...props} />;
        default:
            return null;
    }
};

export default ScInput;