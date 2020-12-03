import React from "react";
import background from "../../../public/images/background.jpg";
import styled from "styled-components";

export const ProfileBlockBase = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
  grid-template-areas: 'pic' 'profile';
  padding: 1em;
  @media (min-width: 500px) {
    grid-template-columns: auto 1fr;
    grid-template-areas: 'pic profile';
    padding: 0em;
  }
`;

export const ProfileImage = styled.img`
    grid-area: pic;
    max-width: 150px;
    padding: 1em;
    @media (min-width: 500px) {
        padding: 0.5em;
        max-width: 200px;
    }
`;

export const InfoData = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    & > p {
        margin: 0.5em 0.25em;
    }
`;

export const InfoBlock = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    grid-template-areas: 'labels info';
`;

export const InfoLabels = styled(InfoData)`
    align-items: flex-end;
    font-weight: bold;
`;

export const ShortP = styled.p`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const cardRowStyle = {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: "2em",
    marginTop: "20px"
};

export const cardRowGapStyle = {marginLeft: "100px"};

export const autoCompleteButtonStyle = {marginLeft: "100px", marginTop: "60px", width: "150px", size: "flex"};
export const normalButtonStyle = {marginLeft: "100px", marginTop: "30px", width: "150px", size: "flex"};

export const CardPile = styled.div`
        margin: 5px;
        position: relative;
        display: inline-block;
        border: dashed 2px royalblue;
        border-radius: 3px;
        width: 105px;
    `;

export const LandingBase = styled.div`
  display: flex;
  justify-content: center;
  grid-area: main;
`;

export const Bar = styled.div`
        background: #DF574B;
    `;

export const RightNav = styled.div`
        text-align: right;
        padding-top: 10px;
        padding-right: 20px;
    `;

export const topLinkStyleFirst = {marginLeft: "5px", color: "white"};
export const topLinkStyle = {marginLeft: "20px", color: "white"};

export const containerHeaderStyle = {
    alignItems: "center",
    backgroundImage: `url(${background})`,
    backgroundSize: "100%",
    display: "flex",
    height: "700px",
    color: "white"
}

export const titlePart = {
    borderLeft: "1px solid #FFFFFF",
    fontWeight: "400",
    fontSize: "2em",
    lineHeight: "1em",
    marginLeft: "120px",
    paddingLeft: "5px",
    marginTop: "-100px"
}

export const Footer = styled.footer`
        background: #434343;
        font-size: 0.8em;
        height: 200px;
        position: relative;
        margin-top: -10px;
    `

export const FooterP = styled.p`
        text-align: center;
        color: white;
    `;

const NotifyBase = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NotifyBox = styled.div`
  padding: 2em;
  border: 1px solid #000;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
`;

const FormButton = styled.button`
  max-width: 200px;
  min-width: 150px;
  max-height: 2em;
  background: #6495ed;
  border: none;
  border-radius: 5px;
  line-height: 2em;
  font-size: 0.8em;
`;

export const ModalNotify = ({ msg, onAccept }) => {
    return (
        <NotifyBase>
            <NotifyBox>
                <p>{msg}</p>
                {<FormButton onClick={onAccept}>Ok</FormButton>}
            </NotifyBox>
        </NotifyBase>
    );
};