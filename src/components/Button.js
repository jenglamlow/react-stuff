import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Toggle from './ToggleButton';

import onA from '../img/on.png';
import offA from '../img/off.png';
import onB from '../img/switch-on.png';
import offB from '../img/switch-off.png';

const Main = () => (
    <div>
        <Toggle label="Yeah" on={onA} off={offA}/>
        <Toggle label="Cool" on={onB} off={offB}/>
    </div>
);

export default Main;
