"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Topbar from "./Topbar";

const TopbarWrapper = ({children}: {children: ReactNode}) => {
    const pathName = usePathname();

    const hideTopbar = ["/login", "/signup"].includes(pathName);
  return (
    <>
        {!hideTopbar && <Topbar />}
        <main>{children}</main>
    </>
    
  )
}

export default TopbarWrapper