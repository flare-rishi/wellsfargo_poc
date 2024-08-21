import { useDispatch, useSelector } from "react-redux";
import { selectData, updateData } from "../../slices/dataSlice/dataSlice";
import {
    FILTER,
    INTERPARENTS,
    INTERTOWER,
    MASKS,
    MEMBEROF,
    PIIVISIBILITY,
    PREEDIT,
    TOWERS,
} from "../../../../constants/constants";

const useConvertToOriginalJson = () => {
    let convertedJson = {};
    const dataJson = structuredClone(useSelector(selectData));
    const dispatch = useDispatch();

    function convertBack(clean = true) {
        for (let key in dataJson) {
            if (key in dataJson[TOWERS]) {
                convertedJson[key] = {};
                for (let layers in dataJson[key]) {
                    if (layers === PREEDIT) {
                        delete dataJson[key][layers];
                    } else if (layers === MASKS || layers === FILTER || layers === PIIVISIBILITY) {
                        convertedJson[key][layers] = dataJson[key][layers];
                    } else {
                        for (let nodes in dataJson[key][layers]) {
                            if (dataJson[key][layers][nodes][INTERPARENTS]) {
                                if (convertedJson[key][INTERTOWER]) {
                                    convertedJson[key][INTERTOWER][nodes] = {};
                                    if (dataJson[key][layers][nodes][MEMBEROF]) {
                                        convertedJson[key][INTERTOWER][nodes][MEMBEROF] =
                                            dataJson[key][layers][nodes][MEMBEROF] || [];
                                    }

                                    if (dataJson[key][layers][nodes][MASKS]) {
                                        convertedJson[key][INTERTOWER][nodes][MASKS] =
                                            dataJson[key][layers][nodes][MASKS];
                                    }

                                    if (dataJson[key][layers][nodes][FILTER]) {
                                        convertedJson[key][INTERTOWER][nodes][FILTER] =
                                            dataJson[key][layers][nodes][FILTER];
                                    }

                                    if (dataJson[key][layers][nodes][PIIVISIBILITY]) {
                                        convertedJson[key][INTERTOWER][nodes][PIIVISIBILITY] =
                                            dataJson[key][layers][nodes][PIIVISIBILITY];
                                    }
                                    if (dataJson[key][layers][nodes][PREEDIT]) {
                                        delete dataJson[key][layers][nodes][PREEDIT];
                                    }
                                } else {
                                    convertedJson[key][INTERTOWER] = {};
                                    convertedJson[key][INTERTOWER][nodes] = {};
                                    if (dataJson[key][layers][nodes][MEMBEROF]) {
                                        convertedJson[key][INTERTOWER][nodes][MEMBEROF] =
                                            dataJson[key][layers][nodes][MEMBEROF] || [];
                                    }

                                    if (dataJson[key][layers][nodes][MASKS]) {
                                        convertedJson[key][INTERTOWER][nodes][MASKS] =
                                            dataJson[key][layers][nodes][MASKS];
                                    }

                                    if (dataJson[key][layers][nodes][FILTER]) {
                                        convertedJson[key][INTERTOWER][nodes][FILTER] =
                                            dataJson[key][layers][nodes][FILTER];
                                    }

                                    if (dataJson[key][layers][nodes][PIIVISIBILITY]) {
                                        convertedJson[key][INTERTOWER][nodes][PIIVISIBILITY] =
                                            dataJson[key][layers][nodes][PIIVISIBILITY];
                                    }
                                    if (dataJson[key][layers][nodes][PREEDIT]) {
                                        delete dataJson[key][layers][nodes][PREEDIT];
                                    }
                                }
                            } else {
                                convertedJson[key][nodes] = {};
                                if (dataJson[key][layers][nodes][MEMBEROF]) {
                                    convertedJson[key][nodes][MEMBEROF] = dataJson[key][layers][nodes][MEMBEROF];
                                }

                                if (dataJson[key][layers][nodes][MASKS]) {
                                    convertedJson[key][nodes][MASKS] = dataJson[key][layers][nodes][MASKS];
                                }

                                if (dataJson[key][layers][nodes][FILTER]) {
                                    convertedJson[key][nodes][FILTER] = dataJson[key][layers][nodes][FILTER];
                                }
                                if (dataJson[key][layers][nodes][PIIVISIBILITY]) {
                                    convertedJson[key][nodes][PIIVISIBILITY] =
                                        dataJson[key][layers][nodes][PIIVISIBILITY];
                                }
                                if (dataJson[key][layers][nodes][PREEDIT]) {
                                    delete dataJson[key][layers][nodes][PREEDIT];
                                }
                            }
                        }
                    }
                }
            } else {
                if (key === PREEDIT) {
                    if (clean === true) delete dataJson[key];
                } else {
                    convertedJson[key] = dataJson[key];
                }
            }
        }

        if (clean === true) dispatch(updateData(dataJson));
        return convertedJson;
    }
    return convertBack;
};

export default useConvertToOriginalJson;
