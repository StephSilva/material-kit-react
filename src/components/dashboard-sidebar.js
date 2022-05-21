import { useEffect } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import { Cog as CogIcon } from "../icons/cog";
import { ShoppingBag as ShoppingBagIcon } from "../icons/shopping-bag";
import { User as UserIcon } from "../icons/user";
import { Users as UsersIcon } from "../icons/users";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { NavItem } from "./nav-item";

const items = [
  {
    href: "/",
    icon: <UsersIcon fontSize="small" />,
    title: "Clientes",
  },
  {
    href: "/empleados",
    icon: <EngineeringIcon fontSize="small" />,
    title: "Empleados",
  },
  {
    href: "/usuarios",
    icon: <UsersIcon fontSize="small" />,
    title: "Usuarios",
  },
  {
    href: "/trabajos",
    icon: <ShoppingBagIcon fontSize="small" />,
    title: "Trabajos",
  },
  {
    href: "/configuracion",
    icon: <CogIcon fontSize="small" />,
    title: "Configuracion",
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"), {
    defaultMatches: true,
    noSsr: false,
  });

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* <div>
          <Box sx={{ p: 1 }}>
            <NextLink href="/" passHref>
              <a>
                <Logo
                  sx={{
                    height: 42,
                    width: 42,
                  }}
                />
              </a>
            </NextLink>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: "#2D3748",
            my: 0.5,
          }}
        /> */}
        <Box sx={{ flexGrow: 1, mt: 3 }}>
          {items.map((item) => (
            <NavItem key={item.title} icon={item.icon} href={item.href} title={item.title} />
          ))}
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: "neutral.900",
            color: "#FFFFFF",
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.900",
          color: "#FFFFFF",
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
