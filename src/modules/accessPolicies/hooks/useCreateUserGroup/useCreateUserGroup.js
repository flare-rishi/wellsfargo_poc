import { EDITME } from "../../../../constants/constants";
import useCreateNode from "../useCreateNode/useCreateNode";
import toast from "react-hot-toast";

function useCreateUserGroup() {
    const createNode = useCreateNode();

    function createUsergroup() {
        // Create a new user group node with EDIT-ME name and empty policy data in first layer
        createNode(EDITME, "");
        toast.success("new user group has been created");
    }

    return createUsergroup;
}

export default useCreateUserGroup;
