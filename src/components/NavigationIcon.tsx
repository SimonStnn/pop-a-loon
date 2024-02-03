import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// React component with the option to add classNames
interface NavigationIconProps {
  to: string;
  icon: IconProp;
  side: "left" | "right";
  className?: string;
}

export default (props: NavigationIconProps) => {
  return (
    <Link
      to={props.to}
      className={`navigation-icon ${props.className}`}
      style={props.side === "left" ? { left: "0.4rem" } : { right: "0.4rem" }}
    >
      <FontAwesomeIcon icon={props.icon} size="lg" />
    </Link>
  );
};
