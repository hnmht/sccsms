import React from "react";
// // import ScDataTypeSelect from "./ScDataTypeSelect/ScDataTypeSelect"; //101 数据类型输入组件
import ScTextInput from "./ScTextInput/ScTextInput"; //301 文本输入组件
import ScNumberInput from "./ScNumberInput/ScNumberInput"; //302 数字输入组件
import ScPasswordInput from "./ScPasswordInput/ScPasswordInput"; //303 密码输入组件
// import ScMobileInput from "./ScMobileInput/ScMobileInput"; //304 移动电话号码输入组件
import ScEmailInput from "./ScEmailInput/ScEmailInput"; //305 电子邮件输入组件
import ScDateInput from "./ScDateInput/ScDateInput"; //306 日期输入组件
import ScDateTimeInput from "./ScDateTimeInput/ScDateTimeInput"; //307 日期时间输入组件

import ScSelectGender from "./ScSelectGender/ScSelectGender"; //401 选择性别
import ScSwitchYesOrNo from "./ScSwitchYesOrNo/ScSwitchYesOrNo"; //402 switch选择是否
import ScCheckYesOrNo from "./ScCheckYesOrNo/ScCheckYesOrNo"; //403 CheckBox选择是否
import ScSelectYesOrNo from "./ScSelectYesOrNo/ScSelectYesOrNo"; //404 Select是否选择
import ScVoucherStatus from "./ScVoucherStatus/ScVoucherStatus"; //405 单据状态显示

// // import ScRoleSelects from "./ScRoleSelects/ScRoleSelects"; //501 角色列表多选组件
// // import ScPersonSelects from "./ScPersonSelects/ScPersonSelects"; // 502 人员多选组件
import ScPersonSelect from "./ScPersonSelect/ScPersonSelect"; // 510 人员单选组件
import ScDeptSelect from "./ScDeptSelect/ScDeptSelect"; //520 部门单选
import ScCSCSelect from "./ScCSCSelect/ScCSCSelect"; //525 现场档案分类单选
import ScUDCSelect from "./ScUDCSelect/ScUDCSelect"; //530 自定义档案类别单选组件
import ScEPCSelect from "./ScEPCSelect/ScEPCSelect"; //540 执行项目类别单选组件
import ScUDASelect from "./ScUDASelect/ScUDASelect"; //550 自定义档案单选组件
import ScEPASelect from "./ScEPASelect/ScEPASelect"; //560 执行项目档案单选组件
import ScCSASelect from "./ScCSASelect/ScCSASelect"; // 570 现场档案单选组件
import ScEPTSelect from "./ScEPTSelect/ScEPTSelect"; //580 执行模板档案
import ScRLSelect from "./ScRiskLevelSelect/ScRiskLevelSelect"; //590 风险等级
import ScDCSelect from "./ScDCSelect/ScDCSelect"; //600 文档类别单选组件
import ScPositionSelect from "./ScPositionSelect/ScPositionSelect"; //610 岗位档案单选组件
import ScTCSelect from "./ScTCSelect/ScTcSelect"; //620 课程单选组件
import ScPPESelect from "./ScPPESelect/ScPPESelect"; //630 劳保用品选择

import ScAvatarUpload from "./ScAvatarUpload/ScAvatarUpload"; //901 头像上传
import ScFileUpload from "./ScFileUpload/ScFileUpload"; //902 文件上传
import { ScInputUnionProps } from "../../dataType/types/scInput";
import { ScDataTypeList } from "../../dataType/types/scDataType";
import ScDateDisplay from "./ScDateDisplay/ScDateDisplay";
import ScDateTimeDisp from "./ScDateTImeDisp/ScDateTimeDisp";

const ScInput: React.FC<ScInputUnionProps> = (props) => {
    const { dataType } = props;
    switch (dataType) {
        case ScDataTypeList.Text:
            return <ScTextInput {...props} />;

        case ScDataTypeList.Number:
            return <ScNumberInput {...props} />;

        case ScDataTypeList.Password:
            return <ScPasswordInput {...props} />;

        // case ScDataTypeList.Mobile:
        //     return <ScMobileInput {...props} />;

        case ScDataTypeList.Email:
            return <ScEmailInput {...props} />;

        case ScDataTypeList.Date:
            return <ScDateInput {...props} />;
        case ScDataTypeList.DateDisp:
            return <ScDateDisplay {...props} />;

        case ScDataTypeList.DateTime:
            return <ScDateTimeInput {...props} />;
        case ScDataTypeList.DateTimeDisp:
            return <ScDateTimeDisp {...props} />;

        case ScDataTypeList.Gender:
            return <ScSelectGender {...props} />;

        case ScDataTypeList.SwitchYesOrNo:
            return <ScSwitchYesOrNo {...props} />;

        case ScDataTypeList.CheckYesOrNo:
            return <ScCheckYesOrNo {...props} />;

        case ScDataTypeList.SelectYesOrNo:
            return <ScSelectYesOrNo {...props} />;

        case ScDataTypeList.VoucherStatus:
            return <ScVoucherStatus {...props} />;

        case ScDataTypeList.Person:
            return <ScPersonSelect {...props} />;

        case ScDataTypeList.SimpDept:
            return <ScDeptSelect {...props} />;

        case ScDataTypeList.SimpCSC:
            return <ScCSCSelect {...props} />;

        case ScDataTypeList.UserDefineCategory:
            return <ScUDCSelect {...props} />;

        case ScDataTypeList.SimpEPC:
            return <ScEPCSelect {...props} />;

        case ScDataTypeList.UserDefinedArchive:
            return <ScUDASelect {...props} />;

        case ScDataTypeList.ExecutionProject:
            return <ScEPASelect {...props} />;

        case ScDataTypeList.ConstructionSite:
            return <ScCSASelect {...props} />;

        case ScDataTypeList.EPT:
            return <ScEPTSelect {...props} />;

        case ScDataTypeList.RiskLevel:
            return <ScRLSelect {...props} />;

        case ScDataTypeList.SimpDC:
            return <ScDCSelect {...props} />;

        case ScDataTypeList.Position:
            return <ScPositionSelect {...props} />;

        case ScDataTypeList.TC:
            return <ScTCSelect {...props} />;

        case ScDataTypeList.PPE:
            return <ScPPESelect {...props} />;
            
        case ScDataTypeList.AvatarUpload:
            return <ScAvatarUpload {...props} />;

        case ScDataTypeList.FileUpload:
            return <ScFileUpload {...props} />;

        default:
            return null;
    }
};
export default ScInput;