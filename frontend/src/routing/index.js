import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import PrivateRouter from './private';
import App from '../components/App';
import {
    Authentication,
    Managers,
    Menu,
    Profile,
} from '../containers';
import { GlobalStyle, Page, Wrapper } from './styles';

const routing = (
    <Router>
        <Wrapper>
            <Menu />
            <Page>
                <GlobalStyle />
                <Route path="/auth" component={Authentication} />
                <PrivateRouter exact path="/" component={App} />
                <PrivateRouter path="/profile" component={Profile} />
                <PrivateRouter path="/managers" component={Managers.List} />
            </Page>
        </Wrapper>
    </Router>
);

export default routing;
