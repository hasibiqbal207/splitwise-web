import PropTypes from "prop-types";
import { Popover, Paper } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const ArrowStyle = styled("span")(({ theme }) => ({
  [theme.breakpoints.up("sm")]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: "absolute",
    borderRadius: "0 0 4px 0",
    transform: "rotate(-135deg)",
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.grey[500], 0.12)}`,
  },
}));

MenuPopover.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
};

export default function MenuPopover({ children, sx, ...other }) {
  const paperSx = {
    p: 1,
    width: 200,
    overflow: "inherit",
    ...sx,
  };

  return (
    <Popover
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      {...other}
    >
      <ArrowStyle className="arrow" />
      <Paper sx={paperSx}>
        {/* Content of the Popover */}
        {children}
      </Paper>
    </Popover>
  );
}
