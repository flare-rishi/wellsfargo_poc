import { useSelector } from "react-redux";

import { selectActiveTab } from "../../slices/crud/crudSlice";
import { selectData } from "../../slices/dataSlice/dataSlice";
import { FILTER, MASKS, MEMBEROF, PIIVISIBILITY, PREEDIT } from "../../../../constants/constants";

function useGetPolicyData() {
    const dataJson = useSelector(selectData);
    const activeTower = useSelector(selectActiveTab);

    function getPolicyData(policyName, policyLayer) {
        var returnPolicyData = {};
        var policyRawData = {};

        policyRawData = dataJson[activeTower][policyLayer][policyName];

        if (policyRawData[FILTER]) {
            returnPolicyData[FILTER] = policyRawData[FILTER];
        } else {
            returnPolicyData[FILTER] = "";
        }

        if (policyRawData[MASKS]) {
            returnPolicyData[MASKS] = policyRawData[MASKS];
        } else {
            returnPolicyData[MASKS] = "";
        }

        if (policyRawData[MEMBEROF]) {
            returnPolicyData[MEMBEROF] = policyRawData[MEMBEROF];
        } else {
            returnPolicyData[MEMBEROF] = [];
        }

        if (policyRawData[PREEDIT]) {
            returnPolicyData[PREEDIT] = policyRawData[PREEDIT];
        }
        if (policyRawData[PIIVISIBILITY]) {
            returnPolicyData[PIIVISIBILITY] = policyRawData[PIIVISIBILITY];
        } else {
            returnPolicyData[PIIVISIBILITY] = [];
        }

        returnPolicyData["policyName"] = policyName;
        returnPolicyData["policyLayer"] = policyLayer;

        return returnPolicyData;
    }

    return getPolicyData;
}

export default useGetPolicyData;
