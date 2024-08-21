import React from "react";

import TableVersionController from "../../tableVersion/TableVersionController";
import BottomTableLevelDiv from "./bottomTableDiv/BottomTableLevelDiv";
import Schema from "../../TableLevelView/schema/Schema";
import Tiles from "../../common/tiles/Tiles";
import Skeleton from "../../../../skeleton/Skeleton";
import ButtonWithIconOnLeft from "../../../../../library/buttonWithIconOnLeft/ButtonWithIconOnLeft";
import FormModal from "../../../../../library/modals/formModal/FormModal";

import {
    DESCRIPTION,
    JOBVIEWTYPETABLE,
    QUALITYMETRICS,
    RECORD,
    VIEWTYPETABLLE,
} from "../../../../../constants/constants";

import "./TableAndJobsLayout.css";
import RefreshButton from "../../../../../library/buttons/RefreshButton";
import SnackBar from "../../../../../library/modals/snackBar/SnackBar";

const TableAndJobsLayout = ({
    type,
    isForkModalOpen,
    handleCloseFormModal,
    handleNewForkModalOpen,
    allowClick,
    handleOnClickRefresh,
    warningMsg,
    recordsError,
    forkId,
}) => {
    return (
        <div className="table-level-main-div">
            {isForkModalOpen && <FormModal handleClose={handleCloseFormModal} open={isForkModalOpen} />}
            <div className="table-level-top-div">
                <div className="table-level-top-left-div">
                    <div className="div-background-border table-top-left-first-div ">
                        <RenderGraph type={type} />
                        {warningMsg && <SnackBar warningMsg={warningMsg} />}

                        <div className={`fork-button ${allowClick ? "wait" : "pointer"}`}>
                            {!forkId && <ButtonWithIconOnLeft handleClick={handleNewForkModalOpen} />}
                            <RefreshButton handleClick={handleOnClickRefresh} />
                        </div>
                    </div>

                    <div className="table-top-left-second-div">
                        <Tiles tileType={RECORD} warningMessage={false} />
                        <Tiles tileType={QUALITYMETRICS} />
                        <Tiles tileType={DESCRIPTION} />
                    </div>
                </div>

                <div className="table-level-top-right-div div-background-border">
                    <Schema />
                </div>
            </div>
            <div className="table-level-bottom-div div-background-border">
                <BottomTableLevelDiv type={type} allowClick={allowClick} />
            </div>
        </div>
    );
};

export default TableAndJobsLayout;

export const RenderGraph = ({ type }) => {
    switch (type) {
        case VIEWTYPETABLLE:
        case JOBVIEWTYPETABLE:
            return <TableVersionController />;
    }
};
