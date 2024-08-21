import { useDispatch, useSelector } from "react-redux";
import { updateDisplayNodes, updateSelectedNodes, updateTempRecord } from "../slices/flowSlice/flowSlice";

function useInitializer() {
    const dispatch = useDispatch();

    function initializer() {
        dispatch(updateSelectedNodes({}));
    }
    return initializer;
}

export default useInitializer;
