import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { rgba } from "polished";
import {
    Box,
    Card as MuiCard,
    CardContent as MuiCardContent,
    Chip as MuiChip,
    Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useTranslation } from "react-i18next";

const illustrationCardStyle = (props) => css`
  ${props.illustration &&
    props.theme.palette.mode !== "dark" &&
    `
    background: ${rgba(props.theme.palette.primary.main, 0.125)};
    color: ${props.theme.palette.primary.main};
  `}
`;

const Card = styled(MuiCard)`
  position: relative;
  margin-bottom: ${(props) => props.theme.spacing(6)};

  ${illustrationCardStyle}
`;

const Typography = styled(MuiTypography)(spacing);

const CardContent = styled(MuiCardContent)`
  position: relative;

  &:last-child {
    padding-bottom: ${(props) => props.theme.spacing(4)};
  }
`;

const Chip = styled(MuiChip)`
  position: absolute;
  top: 16px;
  right: 16px;
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette.secondary.main};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};

  span {
    padding-left: ${(props) => props.theme.spacing(2)};
    padding-right: ${(props) => props.theme.spacing(2)};
  }
`;

const illustrationPercentageStyle = (props) => css`
  ${props.illustration &&
    props.theme.palette.mode !== "dark" &&
    `
    color: ${rgba(props.theme.palette.primary.main, 0.85)};
  `}
`;

const Percentage = styled(MuiTypography)`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: ${(props) => props.theme.spacing(2)};
  }

  ${illustrationPercentageStyle}
`;

const Stats = ({
    title,
    amount,
    chip,
    percentagetext,
    percentagecolor,
    illustration,
}) => {
  const {t} = useTranslation();
    return (
        <Card illustration={illustration}>
            <CardContent>
                <Typography variant="h6" mb={6}>
                    {t(title)}
                </Typography>
                <Typography variant="h3" mb={6}>
                    <Box fontWeight="fontWeightRegular">{amount}</Box>
                </Typography>
                <Percentage
                    variant="subtitle2"
                    color="textSecondary"
                    percentagecolor={percentagecolor}
                >
                    <span>{percentagetext}</span>
                </Percentage>
                {!illustration && <Chip label={t(chip)} />}
            </CardContent>            
        </Card>
    );
};

export default Stats;
