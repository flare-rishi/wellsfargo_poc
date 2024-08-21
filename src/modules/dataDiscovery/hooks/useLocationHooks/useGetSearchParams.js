import { useSearchParams } from "react-router-dom";
import { FORKID, VERSIONID } from "../../../../constants/constants";

const useGetSearchParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    let versionId = searchParams.get(VERSIONID);
    let forkId = searchParams.get(FORKID);
    return { versionId, forkId, setSearchParams, searchParams };
};

export default useGetSearchParams;
