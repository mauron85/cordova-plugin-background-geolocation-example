import React from 'react';
import { TabRouter, addNavigationHelpers, createNavigator } from 'react-navigation';
import MainScene from './scenes/Main';
import MenuScene from './scenes/Menu';
import LogsScene from './scenes/Logs';
import AllLocationsScene from './scenes/AllLocations';
import PendingLocationsScene from './scenes/PendingLocations';
import ConfigScene from './scenes/Config';

const NavView = ({ navigation, router }) => {
    const { state } = navigation;
    const Component = router.getComponentForState(state);
    return (
        <Component
            navigation={addNavigationHelpers({
                ...navigation,
                state: state.routes[state.index],
            })}
        />
    );
};

const Router = TabRouter({
    Main: { screen: MainScene, path: '' },
    Menu: { screen: MenuScene, path: 'menu' },
    Logs: { screen: LogsScene, path: 'logs' },
    AllLocations: { screen: AllLocationsScene, path: 'alllocations' },
    PendingLocations: { screen: PendingLocationsScene, path: 'pendinglocations' },
    Config: { screen: ConfigScene, path: 'config' }
});

const RootNavigator = createNavigator(Router)(NavView);

export default RootNavigator;
