import styled from 'styled-components'

type PillsType = "success" | "error";
function getColors(type: PillsType) {
    switch (type) {
        case "error":
            return "#E61B23";
        case "success":
            return "#32B137";
        default:
            return "#6164A6"
    }

}
const Pills = styled.div<{ type: PillsType, width?: string }>`
    background-color: ${({ type }) => getColors(type) };
    border-radius: 10px;
    padding: 6px 12px;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    width: ${({ width = "auto" }) => width};
    text-align: center;
  `;


export default Pills