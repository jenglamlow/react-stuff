import React from 'react';
import styled from 'styled-components';

const PureComponent = ({className, children}) =>  (
    <h2 className={className}>{children}</h2>
);

const StyledComponent = styled(PureComponent)`
    color: 	DarkSeaGreen 
`;

const Home = () => (
    <div>
        <h1>React Stuff Home </h1>
        <StyledComponent>Pure Component</StyledComponent>
    </div>
);

export default Home;
