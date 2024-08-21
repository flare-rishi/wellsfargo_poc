import { useDispatch, useSelector } from "react-redux";

import {
    selectAllowCLick,
    updateDidLatestVersionChanged,
    updateTableNotFound,
    updateVersionNotFound,
} from "../../slices/tableLevelSlice/tableLevelSlice";

import useGetSearchParams from "../useLocationHooks/useGetSearchParams";

function useOnClickGraphEL() {
    const allowClick = useSelector(selectAllowCLick);

    let { setSearchParams } = useGetSearchParams();
    const dispatch = useDispatch();

    function handleOnClick(queryObj) {
        if (!allowClick) {
            const { versionId, forkId } = queryObj;

            const newQueryObj = {
                versionId: versionId,
                ...(forkId && { forkId }),
            };

            setSearchParams(newQueryObj);
            dispatch(updateVersionNotFound(false));
            dispatch(updateTableNotFound(false));
            dispatch(updateDidLatestVersionChanged(false));
        }
    }
    return handleOnClick;
}

export default useOnClickGraphEL;
