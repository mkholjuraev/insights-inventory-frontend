/* eslint-disable camelcase */
import React from 'react';
import { render, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import CollectionCard from './CollectionCard';
import configureStore from 'redux-mock-store';
import { collectInfoTest } from '../../../__mocks__/selectors';
import { Tooltip } from '@patternfly/react-core';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate
}));

let history = {};
describe('CollectionCard', () => {
    let initialState;
    let mockStore;

    beforeEach(() => {
        mockStore = configureStore();
        history = createMemoryHistory();

        initialState = {
            entityDetails: {
                entity: {
                    updated: '6/01/2014',
                    created: '04/01/2014'
                }
            },
            systemProfileStore: {
                systemProfile: {
                    loaded: true,
                    ...collectInfoTest
                }
            }
        };
    });

    it('should render correctly - no data', () => {
        const store = mockStore({ systemProfileStore: {}, entityDetails: {} });
        const wrapper = render(<Router location={history.location} navigator={history}>
            <CollectionCard store={ store } />
        </Router>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('should render correctly with data', () => {
        const store = mockStore(initialState);
        const wrapper = render(<Router location={history.location} navigator={history}>
            <CollectionCard store={ store } />
        </Router>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('renders tooltip for version', () => {
        const store = mockStore(initialState);
        const wrapper = mount(<Router location={history.location} navigator={history}>
            <CollectionCard store={ store } />
        </Router>);
        const tooltip = mount(wrapper.find(Tooltip).props().content);
        expect(tooltip.first().text()).toEqual(
            'RPM version: test-client'
        );
        expect(tooltip.last().text()).toEqual(
            'Dynamic update version: test-egg'
        );
    });

    [
        'hasClient',
        'hasLastCheckIn',
        'hasRegistered',
        'hasInsightsId',
        'hasReporter'
    ].map((item) => it(`should not render ${item}`, () => {
        const store = mockStore(initialState);
        const wrapper = render(<Router location={history.location} navigator={history}>
            <CollectionCard store={ store } {...{ [item]: false }} />
        </Router>);
        expect(toJson(wrapper)).toMatchSnapshot();
    }));

    it('should render extra', () => {
        const store = mockStore(initialState);
        const wrapper = render(<Router location={history.location} navigator={history}>
            <CollectionCard store={ store } extra={[
                { title: 'something', value: 'test' },
                { title: 'with click', value: '1 tests', onClick: (_e, handleClick) => handleClick('Something', {}, 'small') }
            ]} />
        </Router>);
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
