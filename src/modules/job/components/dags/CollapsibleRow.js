import React, { useState } from "react";
import {
  IconButton,
  TableCell,
  TableRow,
  Collapse,
  Box,
  Typography,
  Link,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const CollapsibleRow = ({ row, columns, collapseContent }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column}>{row[column]}</TableCell>
        ))}
        <TableCell>
          <Link href="{column.id}">View Graph</Link>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand-row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        {open && (
          <TableCell colSpan={columns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                {/* <Typography variant="h6" gutterButton component="div">
                {collapseContent.title}
              </Typography> */}
                {collapseContent.content}
              </Box>
            </Collapse>
          </TableCell>
        )}
      </TableRow>
    </>
  );
};
export default CollapsibleRow;
