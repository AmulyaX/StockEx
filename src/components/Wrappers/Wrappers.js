import React from "react";
import {
  withStyles,
  withTheme,
  Typography as TypographyBase,
  Button as ButtonBase
} from "@material-ui/core";

const getColor = (color, theme, brigtness = "main") => {
  if (color && theme.palette[color] && theme.palette[color][brigtness]) {
    return theme.palette[color][brigtness];
  }
};

const getFontWeight = style => {
  switch (style) {
    case "light":
      return 300;
    case "medium":
      return 500;
    case "bold":
      return 600;
    default:
      return 400;
  }
};

const getFontSize = (size, variant = "", theme) => {
  let multiplier;

  switch (size) {
    case "sm":
      multiplier = 0.8;
      break;
    case "md":
      multiplier = 1.5;
      break;
    case "xl":
      multiplier = 2;
      break;
    case "xxl":
      multiplier = 3;
      break;
    default:
      multiplier = 1;
      break;
  }

  const defaultSize =
    variant && theme.typography[variant]
      ? theme.typography[variant].fontSize
      : theme.typography.fontSize + "px";

  return `calc(${defaultSize} * ${multiplier})`;
};

const createStyled = (styles, options) => {
  const Styled = props => {
    const { children, ...other } = props;
    return children(other);
  };

  return withStyles(styles, options)(Styled);
};

const TypographyExtended = ({ theme, children, weight, size, colorBrightness, ...props }) => (
  <TypographyBase
    style={{
      color: getColor(props.color, theme, colorBrightness),
      fontWeight: getFontWeight(weight),
      fontSize: getFontSize(size, props.variant, theme)
    }}
    {...props}
  >
    {children}
  </TypographyBase>
);

export const Typography = withTheme()(TypographyExtended);

const ButtonExtended = ({ theme, children, ...props }) => {
  const Styled = createStyled({
    button: {
      backgroundColor: getColor(props.color, theme),
      boxShadow: theme.customShadows.widget,
      color: 'white',
      '&:hover': {
        backgroundColor: getColor(props.color, theme, 'light'),
        boxShadow: theme.customShadows.widgetWide,
      }
    }
  });

  return (
    <Styled>
      {({ classes }) => (
        <ButtonBase classes={{ root: classes.button }} {...props}>
          {children}
        </ButtonBase>
      )}
    </Styled>
  );
};

export const Button = withTheme()(ButtonExtended);
