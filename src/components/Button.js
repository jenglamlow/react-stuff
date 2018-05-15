import React from 'react';

import Toggle from './ToggleButton';
import DropDown from './DropDown';

import onA from '../img/on.png';
import offA from '../img/off.png';
import onB from '../img/switch-on.png';
import offB from '../img/switch-off.png';

const Main = () => (
    <div>
        <Toggle label="Yeah" on={onA} off={offA}/>
        <Toggle label="Cool" on={onB} off={offB}/>
        <br/>
        <DropDown/>
        <h2>Stuff</h2>
    </div>
);

export default Main;
