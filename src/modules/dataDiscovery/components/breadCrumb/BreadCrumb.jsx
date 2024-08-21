import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import AvatarWithDropdown from "../../../../library/avatars/AvatarWIthDropdown";

import "./BreadCrumb.css";

export default function BreadCrumb({ breadcrumbs }) {
    return (
        <div className="bread-crumb-main">
            <Stack spacing={2} className="bread-crumb">
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                    {breadcrumbs}
                </Breadcrumbs>
            </Stack>
            <div className="flex-middle">
                <AvatarWithDropdown />
            </div>
        </div>
    );
}
