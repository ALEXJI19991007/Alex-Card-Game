import React from "react";
import PropTypes from "prop-types";
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
    padding: 2em;
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